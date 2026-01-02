// allow non-camelcase as these are events type that go onto the wire
/* eslint-disable camelcase */

// TODO: Change to "sdp_stream_metadata" when MSC3077 is merged
export var SDPStreamMetadataKey = "org.matrix.msc3077.sdp_stream_metadata";
export var SDPStreamMetadataPurpose = /*#__PURE__*/function (SDPStreamMetadataPurpose) {
  SDPStreamMetadataPurpose["Usermedia"] = "m.usermedia";
  SDPStreamMetadataPurpose["Screenshare"] = "m.screenshare";
  return SDPStreamMetadataPurpose;
}({});

/* eslint-enable camelcase */
//# sourceMappingURL=callEventTypes.js.map