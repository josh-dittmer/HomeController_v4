'use server';

import { CreateDeviceRequestT, CreateUserRequestT, EditDeviceRequestT, EditUserRequestT } from "hc_models/models";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createDevice, createUser, deleteDevice, editDevice, editUser } from "../api/requests";
import { getAccessToken } from "../auth/cookies";

export async function createDeviceOnServer(req: CreateDeviceRequestT) {
    const accessToken = getAccessToken(await cookies());
    return createDevice(accessToken, req);
}

export async function createUserOnServer(req: CreateUserRequestT) {
    const accessToken = getAccessToken(await cookies());
    return createUser(accessToken, req);
}

export async function deleteDeviceOnServer(deviceId: string) {
    const accessToken = getAccessToken(await cookies());
    deleteDevice(accessToken, deviceId);
    redirect('/home');
}

export async function editDeviceOnServer(deviceId: string, req: EditDeviceRequestT) {
    const accessToken = getAccessToken(await cookies());
    return editDevice(accessToken, deviceId, req);
}

export async function editUserOnServer(req: EditUserRequestT) {
    const accessToken = getAccessToken(await cookies());
    return editUser(accessToken, req);
}
