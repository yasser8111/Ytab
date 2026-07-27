import { create } from "zustand";
import defaultData from "../data/defaultData.json";

const COLUMNS = 6;
const COLUMN_KEYS = Array.from({ length: COLUMNS }, (_, i) => String(i + 1));

function emptyBoard() {
  return COLUMN_KEYS.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});
}

const defaultColumns = defaultData.reduce((acc, col) => {
  acc[col.id] = col.groups || [];
  return acc;
}, {});

const INITIAL_PAGES = [
  { id: "page-1", label: "Main" },
  { id: "page-2", label: "Work" },
  { id: "page-3", label: "DEV" },
];

const INITIAL_BOARDS = {
  "page-1": defaultColumns,
  "page-2": emptyBoard(),
  "page-3": emptyBoard(),
};

export const useBoardStore = create((set, get) => ({
  activePageId: "page-1",
  pages: INITIAL_PAGES,
  boards: INITIAL_BOARDS,

  setActivePage: (pageId) => set({ activePageId: pageId }),

  addPage: (label) => {
    const newId = `page-${Date.now()}`;
    const newPage = {
      id: newId,
      label: label || `Page ${get().pages.length + 1}`,
    };
    set((state) => ({
      pages: [...state.pages, newPage],
      boards: { ...state.boards, [newId]: emptyBoard() },
      activePageId: newId,
    }));
    return newId;
  },

  deletePage: (pageId) =>
    set((state) => {
      if (state.pages.length <= 1) return state;
      const newPages = state.pages.filter((p) => p.id !== pageId);
      const newBoards = { ...state.boards };
      delete newBoards[pageId];
      const newActiveId =
        state.activePageId === pageId ? newPages[0].id : state.activePageId;
      return { pages: newPages, boards: newBoards, activePageId: newActiveId };
    }),

  renamePage: (pageId, newLabel) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, label: newLabel } : p,
      ),
    })),

  addWidget: (type, targetColumnId) => {
    const allowedTypes = ["group", "pomodoro", "clock", "note"];
    if (!allowedTypes.includes(type)) return;

    const titles = {
      group: "New Group",
      pomodoro: "Pomodoro",
      clock: "Clock",
      note: "Quick Note",
    };

    const newItem = {
      id: Date.now(),
      title: titles[type] || "New Widget",
      type,
      sites: [],
      content: "",
    };

    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? emptyBoard();
      const colKeys = Object.keys(cols);
      if (colKeys.length === 0) return state;

      const finalColId =
        targetColumnId && cols[targetColumnId]
          ? targetColumnId
          : colKeys.reduce(
              (minCol, colId) =>
                cols[colId].length < cols[minCol].length ? colId : minCol,
              colKeys[0],
            );

      return {
        boards: {
          ...state.boards,
          [pageId]: {
            ...cols,
            [finalColId]: [...cols[finalColId], newItem],
          },
        },
      };
    });
  },

  addSiteToGroup: (groupId, newSite) =>
    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? {};
      const updatedCols = {};
      for (const colId of Object.keys(cols)) {
        updatedCols[colId] = cols[colId].map((g) =>
          String(g.id) === String(groupId)
            ? { ...g, sites: [...(g.sites || []), newSite] }
            : g,
        );
      }
      return {
        boards: { ...state.boards, [pageId]: updatedCols },
      };
    }),

  deleteGroup: (groupId) =>
    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? {};
      const updatedCols = {};
      for (const colId of Object.keys(cols)) {
        updatedCols[colId] = cols[colId].filter(
          (g) => String(g.id) !== String(groupId),
        );
      }
      return {
        boards: { ...state.boards, [pageId]: updatedCols },
      };
    }),

  deleteSite: (siteId) =>
    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? {};
      const updatedCols = {};
      for (const colId of Object.keys(cols)) {
        updatedCols[colId] = cols[colId].map((g) => ({
          ...g,
          sites: (g.sites || []).filter((s) => String(s.id) !== String(siteId)),
        }));
      }
      return {
        boards: { ...state.boards, [pageId]: updatedCols },
      };
    }),

  renameGroup: (groupId, newTitle) =>
    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? {};
      const updatedCols = {};
      for (const colId of Object.keys(cols)) {
        updatedCols[colId] = cols[colId].map((g) =>
          String(g.id) === String(groupId) ? { ...g, title: newTitle } : g,
        );
      }
      return {
        boards: { ...state.boards, [pageId]: updatedCols },
      };
    }),

  updateSite: (siteId, updatedData) =>
    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? {};
      const updatedCols = {};
      for (const colId of Object.keys(cols)) {
        updatedCols[colId] = cols[colId].map((g) => ({
          ...g,
          sites: (g.sites || []).map((s) =>
            String(s.id) === String(siteId) ? { ...s, ...updatedData } : s,
          ),
        }));
      }
      return {
        boards: { ...state.boards, [pageId]: updatedCols },
      };
    }),

  updateNoteContent: (groupId, newContent) =>
    set((state) => {
      const pageId = state.activePageId;
      const cols = state.boards[pageId] ?? {};
      const updatedCols = {};
      for (const colId of Object.keys(cols)) {
        updatedCols[colId] = cols[colId].map((g) =>
          String(g.id) === String(groupId) ? { ...g, content: newContent } : g,
        );
      }
      return {
        boards: { ...state.boards, [pageId]: updatedCols },
      };
    }),

  setColumns: (updater) =>
    set((state) => {
      const pageId = state.activePageId;
      const current = state.boards[pageId] ?? emptyBoard();
      const next = typeof updater === "function" ? updater(current) : updater;
      return {
        boards: { ...state.boards, [pageId]: next },
      };
    }),
}));
