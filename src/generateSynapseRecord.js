import { Iterable, fromJS, Record } from 'immutable';
import { prepareNotification, getDelimiter } from './observer';

/**
 * Temporary State Key used for maintaining the Synapse context
 * after set operations.
 */
let temporaryStateKey;

/**
 * This function takes in a default state shape that would be used by a reducer
 * as well as the associated string name of the reducer. It then returns a SynapseRecord
 * based off this data
 *
 * @param {Any} The default state that will be used to generate a record
 * @param {String} The state key associated with the reducer. This will be used for correctly
 * notifying changes.
 * @returns { SynapseRecord } - A synapse record constructed around the state provided
 */
export default function generateSynapseRecord(defaultState: any, stateKey: String, getters: Object) {
  let tempValues = defaultState.toJS ? defaultState.toJS() : defaultState;

  /**
   * A SynapseRecord overrides the base Immutable Record set functionality, and provides a similar Map setIn API
   * for use. The SynpaseRecord prepares notifications for the Observer system based on desired updates.
   *
   */
  class SynapseRecord extends Record(tempValues) {
    constructor(defaults) {
      super(defaults);
      if (getters) {
        console.warn('Providing a list of getters is currently an experimental feature');
        const keys = Object.keys(getters);
        for (let i = 0; i < keys.length; i++) {
          Object.defineProperty(this.prototype, keys[i], {
            get: () => {
              return getters[keys[i]];
            },
          });
        }
      }
      this.__stateKey__ = stateKey;
    }

    /**
     * Called following any immutable operations, so that any SynapseRecord specifics
     * can be attached.
     *
     * @param {SynapseRecord} record - The record which will have context reattached
     * @returns {SynapseRecord} - Returns the updated SynapseRecord
     */
    reattachSynapseContext(record, stateKey = this.__stateKey__) {
      record.__stateKey__ = stateKey;
      return record;
    }

    /**
     * Provides a method to deep update objects on the record. Works on any properties
     * that are a Map on the SynapseRecord
     *
     * @param {Array<String>} keys - The key path to change. The final key will be the destination
     * key that is updated.
     * @param {Any} The value to set at the destination key
     * @returns {SynapseRecord} - Returns the updated SynapseRecord from the setIn operation
     */
    setIn(keys, value) {
      let desiredObject = this.get(keys[0]);
      if (!Iterable.isKeyed(desiredObject)) {
        throw new Error(`Attempted to deep update Keyed Iterable, when it wasn\'t.
        Key: ${keys[0]}`);
      }
      let objKeys = [...keys];
      objKeys.splice(0, 1);
      desiredObject = desiredObject.setIn(objKeys, value);
      const newSet = super.set(keys[0], desiredObject);
      prepareNotification([`${this.__stateKey__}${getDelimiter()}${keys.join(getDelimiter())}`]);
      return this.reattachSynapseContext(newSet);
    }

    /**
     * Used for updating any top level property on the SynapseRecord
     *
     * @param {String} key - The key which represents the associated property to update on the SynapseRecord
     * @param {Any} value -  The value to set on the desired property
     * @returns {SynapseRecord} - Returns the updated SynapseRecord from the setIn operation
     */
    set(key, value) {
      const newSet = super.set(key, value);
      prepareNotification([`${temporaryStateKey || this.__stateKey__}${getDelimiter()}${key}`]);
      return this.reattachSynapseContext(newSet, temporaryStateKey);
    }

    /**
     * Used for batch updating keys. Calls the underlying withMutations on the Immutable record, whilst
     * maintaining the Synapse context
     *
     * @param {Function} fn - The function to be used for withMutations
     */
    withMutations(fn) {
      temporaryStateKey = this.__stateKey__;
      const resultRecord = this.reattachSynapseContext(super.withMutations(fn), temporaryStateKey);
      temporaryStateKey = undefined;
      return resultRecord;
    }
  }

  return new SynapseRecord(defaultState);
}
