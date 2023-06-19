import { RequestHandler, rest } from 'msw';

import { createWaitHandleCollection } from '~testing/wait-handle.ts';

import { API_URL } from '../utils/api-client';
import { mockPetKinds, mockPetList } from './mock-data';

export const defaultWaitHandles = createWaitHandleCollection<
  | 'getAllPets'
  | 'getPetKids'
  | 'getPet'
  | 'deletePet'
  | 'updatePet'
  | 'createPet'
>();

export const defaultHandlers: RequestHandler[] = [
  rest.get(`${API_URL}/pet/all`, async (_req, res, ctx) => {
    await defaultWaitHandles.getAllPetsWaitHandle.wait();
    return res(
      ctx.json(
        mockPetList.map((pet) => ({
          petId: pet.petId,
          petName: pet.petName,
          addedDate: pet.addedDate,
          kind: pet.kind,
        }))
      )
    );
  }),
  rest.get(`${API_URL}/pet/kinds`, async (_req, res, ctx) => {
    await defaultWaitHandles.getPetKidsWaitHandle.wait();
    return res(ctx.json(mockPetKinds));
  }),
  rest.get(`${API_URL}/pet/:petId`, async (req, res, ctx) => {
    await defaultWaitHandles.getPetWaitHandle.wait();
    const petId = Number(req.params.petId);
    return res(ctx.json(mockPetList.find((x) => x.petId === petId)));
  }),
  rest.delete(`${API_URL}/pet/:petId`, async (req, res, ctx) => {
    await defaultWaitHandles.deletePetWaitHandle.wait();
    const petId = Number(req.params.petId);
    return res(ctx.json(mockPetList.find((x) => x.petId === petId)));
  }),
  rest.put(`${API_URL}/pet/:petId`, async (req, res, ctx) => {
    await defaultWaitHandles.updatePetWaitHandle.wait();
    const petId = Number(req.params.petId);
    const body: Record<string, unknown> = await req.json();
    return res(ctx.json({ ...body, petId }));
  }),
  rest.post(`${API_URL}/pet`, async (req, res, ctx) => {
    await defaultWaitHandles.createPetWaitHandle.wait();
    const body: Record<string, unknown> = await req.json();
    return res(ctx.json({ ...body, petId: 43 }));
  }),
];
