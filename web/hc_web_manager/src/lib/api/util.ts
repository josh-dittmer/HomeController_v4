export const getReq = (): RequestInit => ({
    method: 'get'
});

export const postReq = <T>(data: T): RequestInit => ({
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});

export const deleteReq = <T>(data: T): RequestInit => ({
    method: 'delete',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});