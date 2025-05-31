import { create } from 'zustand';

export const useSceneStore = create((set) => ({
  // Currently selected plate ID
  selectedPlateId: 'Plate 1',

  // Initial scene structure with 3 plates

  // Single plate with empty object list
  plates: [
    {
      id: 'Plate 1',
      objects: []
    }
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
