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
    case 'set_expanded_scripture':
      _state['expandedScripture'] = value;
      break;
    case 'set_font_scale':
      _state['fontScale'] = value;
      break;
    case 'set_selected_scale':
      _state['selectedFont'] = value;
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
    case 'set_content_is_dirty':
      _state['contentIsDirty'] = value;
      break;
    case 'set_validation_priority':
      _state['validationPriority'] = value;
      break;
    case 'set_scripture_optimization':
      _state['scriptureOptimization'] = value;
      break;
    case 'set_critical_validation_errors':
      _state['criticalValidationErrors'] = value;
      break;
    case 'set_cache_file_key':
      _state['cacheFileKey'] = value;
      break;
    case 'set_cache_warning_message':
      _state['cacheWarningMessage'] = value;
      break;
    case `set_cached_file`:
      _state['cachedFile'] = value;
      break;
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
  return deepFreeze(_state);
};
