import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  // Currently selected plate ID
  selectedPlateId: 'Plate 1',

  // Initial scene structure with 3 plates
  plates: [
    {
      id: 'Plate 1',
      objects: [
        {
          id: 'cube_1',
          type: 'cube',
          position: [10, 20, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [10, 20, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        {
          id: 'sphere_1',
          type: 'sphere',
          position: [3, 3, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [3, 3, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
      ],
    },
    {
      id: 'Plate 2',
      objects: [
        {
          id: 'cube_2',
          type: 'cube',
          position: [10, 30, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [1, 2, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        {
          id: 'sphere_2',
          type: 'sphere',
          position: [6, 10, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [5, 1, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        {
          id: 'cone_1',
          type: 'cone',
          position: [0, 20, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [0, 4, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
      ],
    },
    {
      id: 'Plate 3',
      objects: [
        {
          id: 'cube_3',
          type: 'cube',
          position: [10, 12.5, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [-2, -1, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
        {
          id: 'cone_2',
          type: 'cone',
          position: [2, 20, 0],
          rotation: [1, 0, 0],
          scale: [1, 1, 1],
          original: {
            position: [2, -2, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
          },
        },
      ],
    },
  ],

  // Update selected plate
  setSelectedPlateId: (id) => set({ selectedPlateId: id }),

  // Update a specific object’s transform
  updateObjectTransform: (plateId, objectId, newTransform) =>
    set((state) => {
      const updatedPlates = state.plates.map((plate) => {
        if (plate.id !== plateId) return plate;

        const updatedObjects = plate.objects.map((obj) =>
          obj.id === objectId ? { ...obj, ...newTransform } : obj
        );

        return { ...plate, objects: updatedObjects };
      });

      return { plates: updatedPlates };
    }),
}));
