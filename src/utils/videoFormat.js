export function videoExpoFormat(uri) {
    let filename = uri.split("/").pop();
  
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `video/${match[1]}` : "video";
  
    return { uri, name: filename, type };
  }