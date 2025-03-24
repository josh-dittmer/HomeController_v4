import { isLeft } from 'fp-ts/lib/Either';
import { CreateDeviceRequestT, CreateDeviceResponse, CreateDeviceResponseT, CreateUserRequestT, EditDeviceRequestT, EditUserRequestT, GetAllDevicesResponse, GetAllDevicesResponseT, GetMyProfileResponse, GetOneDeviceResponse, GetOneDeviceResponseT, TicketResponse, TicketResponseT } from "hc_models/models";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import { redirect } from 'next/navigation';
import { Endpoints } from './endpoints';
import { deleteReq, getReq, postReq } from './util';

export async function request(url: string, data: RequestInit, accessToken: string | undefined): Promise<Response> {
    data.headers = new Headers(data.headers);
    data.headers.set('Authorization', `Bearer ${accessToken}`);

    const response = await fetch(url, data);

    if (response.status === 401) {
        redirect('/login');
        //throw new Error('auth failed');
    } else if (response.status !== 200 && response.status !== 201) {
        throw new Error('request failed');
    }

    return response;
}

export async function requestAndDecode<C extends t.Mixed>(path: string, data: RequestInit, decoder: C, accessToken: string | undefined): Promise<t.TypeOf<typeof decoder>> {
    const response = await request(`${Endpoints.mainApiInternal}${path}`, data, accessToken);
    const parsed: unknown = await response.json();

    const decoded = decoder.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error(`could not validate data: ${PathReporter.report(decoded).join('\n')}`);
    }

    return decoded.right;
}

export async function getAllDevices(accessToken: string | undefined): Promise<GetAllDevicesResponseT> {
    return await requestAndDecode('/device/all', getReq(), GetAllDevicesResponse, accessToken);
}

export async function getOneDevice(accessToken: string | undefined, deviceId: string): Promise<GetOneDeviceResponseT> {
    return await requestAndDecode(`/device/${deviceId}`, getReq(), GetOneDeviceResponse, accessToken);
}

export async function createDevice(accessToken: string | undefined, req: CreateDeviceRequestT): Promise<CreateDeviceResponseT> {
    return await requestAndDecode('/device/create', postReq(req), CreateDeviceResponse, accessToken);
}

export async function editDevice(accessToken: string | undefined, deviceId: string, req: EditDeviceRequestT) {
    return await requestAndDecode(`/device/${deviceId}/edit`, postReq(req), t.type({}), accessToken);
}

export async function deleteDevice(accessToken: string | undefined, deviceId: string) {
    return await requestAndDecode(`/device/${deviceId}/delete`, deleteReq(), t.type({}), accessToken);
}

export async function getTicket(accessToken: string | undefined): Promise<TicketResponseT> {
    return await requestAndDecode('/ticket', getReq(), TicketResponse, accessToken);
}

export async function getMyProfile(accessToken: string | undefined) {
    return await requestAndDecode('/user/me', getReq(), GetMyProfileResponse, accessToken);
}

export async function createUser(accessToken: string | undefined, req: CreateUserRequestT) {
    return await requestAndDecode('/user/create', postReq(req), t.type({}), accessToken);
}

export async function editUser(accessToken: string | undefined, req: EditUserRequestT) {
    return await requestAndDecode('/user/edit', postReq(req), t.type({}), accessToken);
}