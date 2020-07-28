import { renderHook, act } from '@testing-library/react-hooks';
import { useStateReducer } from '../src/core/useStateReducer';
import { defaultState } from './fixtures/useStateReducer';
jest.mock('localforage');

describe('useStateReducer', () => {
  test('should use default state and match snapshots of objects', () => {
    const { result } = renderHook(() => useStateReducer(defaultState));
    const [state, actions] = result.current;
    expect(state).toMatchSnapshot();
    expect(actions).toMatchSnapshot();
  });

  test('should test setTargetRepoFromSourceRepo', () => {
    const { result } = renderHook(() => useStateReducer(defaultState));
    const expectedOutput = 'https://new-url.com';

    act(() => {
      result.current[1].setConfig({
        ...result.current[0].config,
        authentication: {
          ...result.current[0].config.authentication,
          server:expectedOutput,
        },
      });
    });
    expect(result.current[0].config.authentication.server).toBe(expectedOutput);
  });

  test('should set empty source repository', () => {
    const { result } = renderHook(() => useStateReducer(defaultState));

    act(() => {
      result.current[1].setLanguage();
    });
    expect(result.current[0].sourceRepository).toBeFalsy();
  });
});
