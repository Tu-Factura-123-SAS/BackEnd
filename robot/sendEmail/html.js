const htmlMail = (
  toX,
  linkX,
  subjectX,
) => {
  return `<html><head>
    <style>
      .postcard {
        width: 400px;
        height: 333px;
        background: #ffc107;
        text-align: center;
      }
      .postcard-text {
        font-family: Arial, sans-serif;
        font-size: 33px;
        color: #FFF;
        padding: 40px 0px;
      }
      .postcard-names {
        font-family: Monaco, monospace;
        font-size: 20px;
        text-align: left;
        color: #FFF;
        margin: 15px;
        padding-top: 5px;
        overflow: hidden;
        white-space: nowrap;
      }
      .postcard-footer {
        font-family: Monaco, monospace;
        font-size: 14px;
        color: #FFF;
        padding-top: 40px;
      }
    </style>
  </head><body>
    <div class="postcard">
      <div class="postcard-names">
        From: ${toX}
      </div>
      <div class="postcard-text">
          <p>Clic <a href="${linkX}">aquí</a> para entrar.</p>
      </div>
      <div class="postcard-footer">
          ${subjectX}
      </div>
      </div>
  </body></html>`;
};

module.exports = {
  htmlMail,
};
