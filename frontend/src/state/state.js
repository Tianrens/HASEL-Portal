import { atomWithStore } from 'jotai/zustand';
import create from 'zustand/vanilla';
import { useAtom } from 'jotai';

const store = create(() => ({}));
const stateAtom = atomWithStore(store);

// Used for inside react component to get the state
const useDoc = (fieldName) => {
    const [state, setState] = useAtom(stateAtom);
    const setField = (value) => {
        setState({ [fieldName]: value });
    };
    return [state[fieldName], setField];
};

// Used for outside react component to get the state
const accessDoc = (fieldName) => {
    const setField = (value) => {
        store.setState({ [fieldName]: value });
    };
    return [store.getState()[fieldName], setField];
};

export { stateAtom, useDoc, accessDoc };
