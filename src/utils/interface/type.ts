export type RestfulMethod = 'post' | 'get' | 'put' | 'delete' | 'options' | 'head' | 'patch' | 'all';
export type TypeRouter = {
    path: string;
    label?: string;
    method: RestfulMethod;
}

export type Type_payload = {
    _id: string,
    company_id?: string,
    department_ids?: string[],
    code?: string,
    name?: string,
}