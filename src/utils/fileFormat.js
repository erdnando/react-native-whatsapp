export function fileExpoFormat(uri) {
  let filename = uri.split("/").pop();

  let match = /\.(\w+)$/.exec(filename);
  let type = match ? `application/${match[1]}` : "txt";

  return { uri, name: filename, type };
}