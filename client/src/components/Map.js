import React, { useContext } from "react";
import { Subscription } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import differnceInMinutes from "date-fns/difference_in_minutes";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useClient } from "../client";
import { GET_PINS } from "../graphql/queries";
import { DELETE_PIN } from "../graphql/mutations";
import { PIN_ADDED, PIN_DELETED, PIN_UPDATED } from "../graphql/subscriptions";

import context from "../context";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width:650px)");
  const client = useClient();
  const { state, dispatch } = useContext(context);
  const [viewport, setViewport] = React.useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = React.useState(null);
  const [popUp, setPopUp] = React.useState(null);
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport(prev => ({ ...prev, latitude, longitude }));
        setUserPosition({ latitude, longitude });
      });
    }
  }, []);
  React.useEffect(() => {
    getAllPins();
  }, []);
  const getAllPins = async () => {
    const { getPins } = await client.request(GET_PINS);
    dispatch({ type: "GET_ALL_PINS", payload: getPins });
  };
  const handleMapClick = ({ lngLat, leftButton }) => {
    setPopUp(null);
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { latitude, longitude }
    });
  };
  const highlightNewPin = pin => {
    const newPin = differnceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return newPin ? "limeGreen" : "darkBlue";
  };
  const handleSelectPin = pin => {
    setPopUp(pin);
    dispatch({ type: "CURRENT_PIN", payload: pin });
  };
  const isAuthor = pin => pin.author._id === state.currentUser._id;
  const deletePin = async () => {
    await client.request(DELETE_PIN, { pin: popUp._id });
    setPopUp(null);
  };
  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        width="100%"
        height={"calc(100vh - 64px)"}
        mapStyle={"mapbox://styles/mapbox/streets-v9"}
        mapboxApiAccessToken={process.env.REACT_APP_MAP}
        scrollZoom={!mobileSize}
        {...viewport}
        onViewportChange={viewport => setViewport(viewport)}
        onClick={handleMapClick}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={viewport => setViewport(viewport)}
          />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotPink" />
          </Marker>
        )}
        {state.pins.length > 0 &&
          state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                size={40}
                onClick={() => handleSelectPin(pin)}
                color={highlightNewPin(pin)}
              />
            </Marker>
          ))}
        {popUp && (
          <Popup
            anchor="top"
            closeOnClick={false}
            latitude={popUp.latitude}
            longitude={popUp.longitude}
            onClose={() => setPopUp(null)}
          >
            <img src={popUp.image} alt={popUp.title} />
            <div className={classes.popupTab}>
              <Typography>
                {popUp.latitude.toFixed(6)},{popUp.longitude.toFixed(6)}
              </Typography>
              {isAuthor(popUp) && (
                <Button onClick={deletePin}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Subscription
        subscription={PIN_ADDED}
        onSubscriptionData={({ subscriptionData }) => {
          dispatch({ type: "DELETE__PIN", payload: deletePin });
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: "NEW_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_DELETED}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          dispatch({ type: "DELETE__PIN", payload: pinDeleted });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          dispatch({ type: "UPDATED_PIN", payload: pinUpdated });
        }}
      />
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
