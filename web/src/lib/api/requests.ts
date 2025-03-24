import { isLeft } from 'fp-ts/lib/Either';
import { CreateDeviceRequestT, CreateDeviceResponse, CreateDeviceResponseT, CreateUserRequestT, EditDeviceRequestT, EditUserRequestT, GetAllDevicesResponse, GetAllDevicesResponseT, GetMyProfileResponse, GetOneDeviceResponse, GetOneDeviceResponseT, TicketResponse, TicketResponseT } from "hc_models/models";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import { redirect } from 'next/navigation';
import { Endpoints } from './endpoints';
import { deleteReq, getReq, postReq } from './util';

export async function request(url: string, data: RequestInit, accessToken?: string): Promise<Response> {
    data.headers = new Headers(data.headers);

    if (accessToken)
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

export async function requestAndDecode<C extends t.Mixed>(path: string, data: RequestInit, decoder: C, accessToken: string | undefined, proxy: boolean = false): Promise<t.TypeOf<typeof decoder>> {
    const url = (proxy ? Endpoints.selfApiPublic : Endpoints.mainApiInternal) + path;

    const response = await request(url, data, accessToken);
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

export async function createDevice(req: CreateDeviceRequestT): Promise<CreateDeviceResponseT> {
    return await requestAndDecode('/device/create', postReq(req), CreateDeviceResponse, undefined, true);
}

export async function editDevice(deviceId: string, req: EditDeviceRequestT) {
    return await requestAndDecode(`/device/${deviceId}/edit`, postReq(req), t.type({}), undefined, true);
}

export async function deleteDevice(deviceId: string) {
    return await requestAndDecode(`/device/${deviceId}/delete`, deleteReq(), t.type({}), undefined, true);
}

export async function getTicket(): Promise<TicketResponseT> {
    return await requestAndDecode('/ticket', getReq(), TicketResponse, undefined, true);
}

export async function getMyProfile(accessToken: string | undefined) {
    return await requestAndDecode('/user/me', getReq(), GetMyProfileResponse, accessToken);
}

export async function createUser(req: CreateUserRequestT) {
    return await requestAndDecode('/user/create', postReq(req), t.type({}), undefined, true);
}

export async function editUser(req: EditUserRequestT) {
    return await requestAndDecode('/user/edit', postReq(req), t.type({}), undefined, true);
}