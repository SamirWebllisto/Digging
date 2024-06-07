import Client from 'ssh2-sftp-client'
let sftp = new Client();

let src = "./dist"
let dst = "/opt/wow-digging/dist"

sftp.connect({
  host: "34.92.143.247",
  port: "22",
  username: 'root',
  password: 'ecs5mnC&qGEc'
}).then(async () => {
  try {
    await sftp.rmdir(dst, true);
  } catch (error) { /* empty */ }
  sftp.on('upload', info => {
    console.log(`Listener: Uploaded ${info.source}`);
  });
  let rslt = await sftp.uploadDir(src, dst);
  return rslt;
}).then(data => {
  console.log(data, 'the data info');
  sftp.end();
  console.log('upload finished!!!');
}).catch(err => {
  console.log(err, 'catch error');
  console.log('upload fail~~~');
});
