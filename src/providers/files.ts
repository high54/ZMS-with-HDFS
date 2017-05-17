
import { services } from 'zetapush-js';

export class FilesProvider extends services.Macro {

    listFiles(folder) {
        return this.$publish('listFiles', {folder});
    }
    uploadFile(path)
    {
      return this.$publish('uploadFile', {path});
    }
    addFile(guid)
    {
      return this.$publish('addFile',{guid});
    }


}
