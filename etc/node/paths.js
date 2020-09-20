import path from "path";

export default {
    ROOT: path.join(path.dirname(path.dirname(path.dirname(__filename))), path.sep),
    ETC: path.join(path.dirname(path.dirname(__filename)), path.sep),
    PATH: path.join(path.dirname(__filename), path.sep),
}