var AWriter = function() {
  this._status = AWriter.STATUS_READY;
};

AWriter.WRITE_PLAIN_TEXT = 1;
AWriter.WRITE_CSV = 2;
AWriter.WRITE_XML = 3;

AWriter.STATUS_ERROR = 0;
AWriter.STATUS_READY = 1;
AWriter.STATUS_WRITING = 2;

AWriter.prototype.getStatus = function() {
  var status = '';
  switch(this._status) {
    case AWriter.STATUS_ERROR:
      status = 'error';
      break;
    case AWriter.STATUS_READY:
      status = 'ready';
      break;
    case AWriter.STATUS_WRITING:
      status = 'writing';
      break;
  }
  return status;
};

module.exports = AWriter;