module.exports = (conn, types) => {
  let UploadModel = conn.define('Upload', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      set(id) {
        this.setDataValue('Id', id < 0 ? null : id);
      }
    },
    FileName: {
      type: types.STRING
    },
    MimeType: {
      type: types.STRING
    },
    Data: {
      type: types.BLOB
    }
  }, {
    timestamps: true,
    createdAt: 'CreateDate',
    updatedAt: false
  });

  return UploadModel;
};