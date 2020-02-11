export default (state, { type, payload }) => {
  switch (type) {
    case "LOGIN_USER":
      return { ...state, currentUser: payload };
    case "LOGGED_IN":
      return { ...state, isAuth: payload };
    case "SIGN_OUT":
      return { ...state, isAuth: false, currentUser: null };
    case "CREATE_DRAFT":
      return {
        ...state,
        draft: { latitude: 0, longitude: 0 },
        currentPin: null
      };
    case "UPDATE_DRAFT_LOCATION":
      return { ...state, draft: payload };
    case "DELETE_DRAFT":
      return { ...state, draft: null };
    case "GET_ALL_PINS":
      return { ...state, pins: payload };
    case "NEW_PIN":
      const newPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return { ...state, pins: [...prevPins, newPin] };
    case "CURRENT_PIN":
      return { ...state, currentPin: payload, draft: null };
    case "DELETE__PIN":
      const deletedPin = payload;
      const newPins = state.pins.filter(pin => pin._id !== deletedPin._id);
      return { ...state, pins: newPins };
    case "UPDATED_PIN":
      const updatedPin = payload;
      const updatedPins = state.pins.map(pin =>
        pin._id === updatedPin._id ? updatedPin : pin
      );
      return { ...state, pins: updatedPins, currentPin: updatedPin };
    default:
      return state;
  }
};
