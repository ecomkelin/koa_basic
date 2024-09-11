import Router from 'koa-router';
import * as Service from './service';
import * as ServiceRestore from './service.restore';

export default function router_archive(router: Router) {
    router.post('/sys_archive/save', Service.save);
    router.post('/sys_archive/saveMany', Service.saveMany);

    // 没有修改

    router.get('/sys_archive/list', Service.list);
    router.get('/sys_archive/detail/:id', Service.detail);

    router.delete('/sys_archive/delete/:id', Service.deleteOne);
    router.delete('/sys_archive/deleteMany', Service.deleteMany);

    router.post('/sys_archive/restore/:id', ServiceRestore.restore);
    router.post('/sys_archive/restoreMany', ServiceRestore.restoreMany);
}