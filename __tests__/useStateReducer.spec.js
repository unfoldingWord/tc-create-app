import { renderHook, act } from '@testing-library/react-hooks';
import { useStateReducer } from '../src/core/useStateReducer';
import { defaultState } from './fixtures/useStateReducer';


//TODO:
describe('useStateReducer', () => {
  test('', () => {
    const { result } = renderHook(() => useStateReducer(defaultState));
    const [state, actions] = result.current;
    expect(state).toMatchSnapshot();
    expect(actions).toMatchSnapshot();
  });
});
