import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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

import { EventType } from "../@types/event.js";
import { logger as rootLogger } from "../logger.js";
import { KeyTransportEvents } from "./IKeyTransport.js";
import { TypedEventEmitter } from "../models/typed-event-emitter.js";
import { RoomEvent } from "../models/room.js";
export class RoomKeyTransport extends TypedEventEmitter {
  setParentLogger(parentLogger) {
    this.logger = parentLogger.getChild("[RoomKeyTransport]");
  }
  constructor(room, client, statistics, parentLogger) {
    super();
    this.room = room;
    this.client = client;
    this.statistics = statistics;
    _defineProperty(this, "logger", rootLogger);
    this.setParentLogger(parentLogger !== null && parentLogger !== void 0 ? parentLogger : rootLogger);
  }
  start() {
    this.room.on(RoomEvent.Timeline, ev => void this.consumeCallEncryptionEvent(ev));
  }
  stop() {
    this.room.off(RoomEvent.Timeline, ev => void this.consumeCallEncryptionEvent(ev));
  }
  consumeCallEncryptionEvent(event) {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var isRetry = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : false;
      yield _this.client.decryptEventIfNeeded(event);
      if (event.isDecryptionFailure()) {
        if (!isRetry) {
          _this.logger.warn("Decryption failed for event ".concat(event.getId(), ": ").concat(event.decryptionFailureReason, " will retry once only"));
          // retry after 1 second. After this we give up.
          setTimeout(() => void _this.consumeCallEncryptionEvent(event, true), 1000);
        } else {
          _this.logger.warn("Decryption failed for event ".concat(event.getId(), ": ").concat(event.decryptionFailureReason));
        }
        return;
      } else if (isRetry) {
        _this.logger.info("Decryption succeeded for event ".concat(event.getId(), " after retry"));
      }
      if (event.getType() !== EventType.CallEncryptionKeysPrefix) return Promise.resolve();
      if (!_this.room) {
        _this.logger.error("Got room state event for unknown room ".concat(event.getRoomId(), "!"));
        return Promise.resolve();
      }
      _this.onEncryptionEvent(event);
    })();
  }

  /** implements {@link IKeyTransport#sendKey} */
  sendKey(keyBase64Encoded, index, members) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // members not used in room transports as the keys are sent to all room members
      var content = {
        keys: [{
          index: index,
          key: keyBase64Encoded
        }],
        device_id: _this2.client.getDeviceId(),
        call_id: "",
        sent_ts: Date.now()
      };
      try {
        yield _this2.client.sendEvent(_this2.room.roomId, EventType.CallEncryptionKeysPrefix, content);
      } catch (error) {
        _this2.logger.error("Failed to send call encryption keys", error);
        var matrixError = error;
        if (matrixError.event) {
          // cancel the pending event: we'll just generate a new one with our latest
          // keys when we resend
          _this2.client.cancelPendingEvent(matrixError.event);
        }
        throw error;
      }
    })();
  }
  onEncryptionEvent(event) {
    var userId = event.getSender();
    var content = event.getContent();
    var deviceId = content["device_id"];
    var callId = content["call_id"];
    if (!userId) {
      this.logger.warn("Received m.call.encryption_keys with no userId: callId=".concat(callId));
      return;
    }

    // We currently only handle callId = "" (which is the default for room scoped calls)
    if (callId !== "") {
      this.logger.warn("Received m.call.encryption_keys with unsupported callId: userId=".concat(userId, ", deviceId=").concat(deviceId, ", callId=").concat(callId));
      return;
    }
    if (!Array.isArray(content.keys)) {
      this.logger.warn("Received m.call.encryption_keys where keys wasn't an array: callId=".concat(callId));
      return;
    }
    if (userId === this.client.getUserId() && deviceId === this.client.getDeviceId()) {
      // We store our own sender key in the same set along with keys from others, so it's
      // important we don't allow our own keys to be set by one of these events (apart from
      // the fact that we don't need it anyway because we already know our own keys).
      this.logger.info("Ignoring our own keys event");
      return;
    }
    this.statistics.counters.roomEventEncryptionKeysReceived += 1;
    var age = Date.now() - (typeof content.sent_ts === "number" ? content.sent_ts : event.getTs());
    this.statistics.totals.roomEventEncryptionKeysReceivedTotalAge += age;
    for (var key of content.keys) {
      if (!key) {
        this.logger.info("Ignoring false-y key in keys event");
        continue;
      }
      var encryptionKey = key.key;
      var encryptionKeyIndex = key.index;
      if (!encryptionKey || encryptionKeyIndex === undefined || encryptionKeyIndex === null || callId === undefined || callId === null || typeof deviceId !== "string" || typeof callId !== "string" || typeof encryptionKey !== "string" || typeof encryptionKeyIndex !== "number") {
        this.logger.warn("Malformed call encryption_key: userId=".concat(userId, ", deviceId=").concat(deviceId, ", encryptionKeyIndex=").concat(encryptionKeyIndex, " callId=").concat(callId));
      } else {
        this.logger.debug("onCallEncryption userId=".concat(userId, ":").concat(deviceId, " encryptionKeyIndex=").concat(encryptionKeyIndex, " age=").concat(age, "ms"));
        this.emit(KeyTransportEvents.ReceivedKeys, userId, deviceId, encryptionKey, encryptionKeyIndex, event.getTs());
      }
    }
  }
}
//# sourceMappingURL=RoomKeyTransport.js.map