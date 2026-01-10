// ╔═══════════════════════════════════════════════════════════════════════════════════╗
// ║                           نظام التراجع والإعادة - UndoRedo                         ║
// ╚═══════════════════════════════════════════════════════════════════════════════════╝

import { useRef, useCallback } from 'react';

const MAX_HISTORY_SIZE = 20;
const DEBOUNCE_DELAY = 500;

export const useUndoRedo = () => {
  const historyRef = useRef([]);
  const currentIndexRef = useRef(-1);
  const debounceTimerRef = useRef(null);
  const isRestoringRef = useRef(false);

  const saveToHistory = useCallback((state) => {
    if (isRestoringRef.current) return;
    
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      const snapshot = JSON.stringify(state);
      
      if (currentIndexRef.current >= 0) {
        const lastSnapshot = JSON.stringify(historyRef.current[currentIndexRef.current]);
        if (snapshot === lastSnapshot) return;
      }
      
      if (currentIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
      }
      
      historyRef.current.push(JSON.parse(snapshot));
      currentIndexRef.current = historyRef.current.length - 1;
      
      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current.shift();
        currentIndexRef.current--;
      }
    }, DEBOUNCE_DELAY);
  }, []);

  const saveImmediate = useCallback((state) => {
    if (isRestoringRef.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    const snapshot = JSON.stringify(state);
    if (currentIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, currentIndexRef.current + 1);
    }
    historyRef.current.push(JSON.parse(snapshot));
    currentIndexRef.current = historyRef.current.length - 1;
    
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current.shift();
      currentIndexRef.current--;
    }
  }, []);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      isRestoringRef.current = true;
      currentIndexRef.current--;
      const state = historyRef.current[currentIndexRef.current];
      setTimeout(() => { isRestoringRef.current = false; }, 100);
      return state;
    }
    return null;
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      isRestoringRef.current = true;
      currentIndexRef.current++;
      const state = historyRef.current[currentIndexRef.current];
      setTimeout(() => { isRestoringRef.current = false; }, 100);
      return state;
    }
    return null;
  }, []);

  const canUndo = useCallback(() => currentIndexRef.current > 0, []);
  const canRedo = useCallback(() => currentIndexRef.current < historyRef.current.length - 1, []);

  const initHistory = useCallback((initialState) => {
    historyRef.current = [JSON.parse(JSON.stringify(initialState))];
    currentIndexRef.current = 0;
  }, []);

  const isRestoring = useCallback(() => isRestoringRef.current, []);

  return { saveToHistory, saveImmediate, undo, redo, canUndo, canRedo, initHistory, isRestoring };
};

export const createSnapshot = (state) => JSON.parse(JSON.stringify(state));

export const restoreFromSnapshot = (snapshot, setters) => {
  if (snapshot.itemTypes && setters.setItemTypes) setters.setItemTypes(snapshot.itemTypes);
  if (snapshot.places && setters.setPlaces) setters.setPlaces(snapshot.places);
  if (snapshot.workItems && setters.setWorkItems) setters.setWorkItems(snapshot.workItems);
  if (snapshot.programming && setters.setProgramming) setters.setProgramming(snapshot.programming);
  if (snapshot.categories && setters.setCategories) setters.setCategories(snapshot.categories);
};
