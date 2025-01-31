'use server';

import { isLeft } from 'fp-ts/lib/Either';
import { CreateDeviceRequestT, CreateDeviceResponse, CreateDeviceResponseT, CreateUserRequestT, EditDeviceRequestT, EditUserRequestT, GetAllDevicesResponse, GetAllDevicesResponseT, GetMyProfileResponse, GetOneDeviceResponse, GetOneDeviceResponseT, TicketResponse, TicketResponseT } from "hc_models/models";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/actions";
import { Endpoints } from "./endpoints";
import { deleteReq, getReq, postReq } from './util';

export async function request(url: string, data: RequestInit, useAuth: boolean): Promise<Response> {
    if (useAuth) {
        try {
            const accessToken = await getAccessToken();

            data.headers = new Headers(data.headers);
            data.headers.set('Authorization', `Bearer ${accessToken}`);
        } catch {
            redirect('/login');
        }
    }

    const response = await fetch(url, data);

    if (response.status === 401) {
        redirect('/login');
    } else if (response.status !== 200 && response.status !== 201) {
        throw new Error('request failed');
    }

    return response;
}

export async function requestAndDecode<C extends t.Mixed>(path: string, data: RequestInit, decoder: C): Promise<t.TypeOf<typeof decoder>> {
    const response = await request(`${Endpoints.mainApi}${path}`, data, true);
    const parsed: unknown = await response.json();

    const decoded = decoder.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error(`could not validate data: ${PathReporter.report(decoded).join('\n')}`);
    }

    return decoded.right;
}

export async function getAllDevices(): Promise<GetAllDevicesResponseT> {
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    return await requestAndDecode('/device/all', getReq(), GetAllDevicesResponse);
}

export async function getOneDevice(deviceId: string): Promise<GetOneDeviceResponseT> {
    return await requestAndDecode(`/device/${deviceId}`, getReq(), GetOneDeviceResponse);
}

export async function createDevice(req: CreateDeviceRequestT): Promise<CreateDeviceResponseT> {
    return await requestAndDecode('/device/create', postReq(req), CreateDeviceResponse);
}

export async function editDevice(deviceId: string, req: EditDeviceRequestT) {
    return await requestAndDecode(`/device/${deviceId}/edit`, postReq(req), t.type({}));
}

export async function deleteDevice(deviceId: string) {
    return await requestAndDecode(`/device/${deviceId}/delete`, deleteReq(), t.type({}));
}

export async function getTicket(): Promise<TicketResponseT> {
    return await requestAndDecode('/ticket', getReq(), TicketResponse);
}

export async function getMyProfile() {
    return await requestAndDecode('/user/me', getReq(), GetMyProfileResponse);
}

export async function createUser(req: CreateUserRequestT) {
    return await requestAndDecode('/user/create', postReq(req), t.type({}));
}

export async function editUser(req: EditUserRequestT) {
    return await requestAndDecode('/user/edit', postReq(req), t.type({}));
}