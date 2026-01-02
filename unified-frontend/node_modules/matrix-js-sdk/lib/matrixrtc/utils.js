import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2025 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Detects when a key for a given index is outdated.
 */
export class OutdatedKeyFilter {
  constructor() {
    // Map of participantId -> keyIndex -> timestamp
    _defineProperty(this, "tsBuffer", new Map());
  }

  /**
   * Check if there is a recent key with the same keyId (index) and then use the creationTS to decide what to
   * do with the key. If the key received is older than the one already in the buffer, it is ignored.
   * @param participantId
   * @param item
   */
  isOutdated(participantId, item) {
    var _this$tsBuffer$get;
    if (!this.tsBuffer.has(participantId)) {
      this.tsBuffer.set(participantId, new Map());
    }
    var latestTimestamp = (_this$tsBuffer$get = this.tsBuffer.get(participantId)) === null || _this$tsBuffer$get === void 0 ? void 0 : _this$tsBuffer$get.get(item.keyIndex);
    if (latestTimestamp && latestTimestamp > item.creationTS) {
      // The existing key is more recent, ignore this one
      return true;
    }
    this.tsBuffer.get(participantId).set(item.keyIndex, item.creationTS);
    return false;
  }
}
export function getParticipantId(userId, deviceId) {
  return "".concat(userId, ":").concat(deviceId);
}
//# sourceMappingURL=utils.js.map