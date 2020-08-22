import deepFreeze from 'deep-freeze';

export const stateReducer = (state, action) => {
  let _state = { ...state };
  const { type, value } = action;

  switch (type) {
  case 'set_authentication':
    _state['authentication'] = value;
    break;
  case 'set_language':
    _state['language'] = value;
    break;
  case 'set_expanded_scripture_pane':
    _state['expandedScripturePane'] = value;
    break;
  case 'set_font_scale':
    _state['fontScale'] = value;
    break;
  case 'set_config':
    _state['config'] = value;
    break;
  case 'set_source_repository':
    _state['sourceRepository'] = value;
    break;
  case 'set_target_repository':
    _state['targetRepository'] = value;
    break;
  case 'set_organization':
    _state['organization'] = value;
    break;
  case 'set_filepath':
    _state['filepath'] = value;
    break;
  case 'set_resource_links':
    _state['resourceLinks'] = value;
    break;
  default:
    throw new Error(`Unsupported action type: ${action.type}`);
  }
  return deepFreeze(_state);
};
