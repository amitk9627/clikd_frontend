import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow, Polyline } from '@react-google-maps/api';
import { IconArrowLeft } from '@tabler/icons-react';
// import { mapOptions } from './MapTracking';
import startpoint from './startpoint.png';
import endpoint from './endpoint.png';
import busEnd from './busEnd.png';
import busStart from './busStart.png';
import reachstop from './reachstop.png';
import Loader from 'ui-component/LoaderCircular';
const gogSecretApi = process.env.REACT_APP_GOOGLE_API_KEY;
const gogdecodeApi = process.env.REACT_APP_GOOGLE_API_KEY_COM;
import axios from 'axios';
const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};
const mapOptions = {
  styles: [
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#d6e2e6'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#cddbe0'
        }
      ]
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#7492a8'
        }
      ]
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'labels.text.fill',
      stylers: [
        {
          lightness: 25
        }
      ]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#d6e2e6'
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#cddbe0'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#dae6eb'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#7492a8'
        }
      ]
    },
    {
      featureType: 'landscape.natural.terrain',
      elementType: 'all',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#d6e2e6'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#588ca4'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [
        {
          saturation: -100
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#cae7a8'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#bae6a1'
        }
      ]
    },
    {
      featureType: 'poi.sports_complex',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#c6e8b3'
        }
      ]
    },
    {
      featureType: 'poi.sports_complex',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#bae6a1'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#41626b'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          saturation: -25
        },
        {
          lightness: 10
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#f7fdff'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#beced4'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#eef3f5'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#cddbe0'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#edf3f5'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#cddbe0'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [
        {
          saturation: -70
        }
      ]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#588ca4'
        }
      ]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#008cb5'
        }
      ]
    },
    {
      featureType: 'transit.station.airport',
      elementType: 'geometry.fill',
      stylers: [
        {
          saturation: -100
        },
        {
          lightness: -5
        }
      ]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a6cbe3'
        }
      ]
    }
  ]
};

export const CompletedMapTrack = ({ busInfo, StopInfo, handleClose, busDetails, driverDetails, tripDetails, routeDetails }) => {
  const [StopCoordinates, setStopsCoordinates] = useState([]);
  // console.log(tripDetails)

  const [StopPolyLineCoord, setStopPolyLineCoord] = useState([]);
  const [BusCoordinates, setBusCoordinates] = useState([]);
  const [center, setCenter] = useState({});
  const [map, setMap] = useState(null);
  const [showRoute, setShowRoute] = useState(true);
  const [showBus, setShowBus] = useState(true);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: gogSecretApi ?? '',
    libraries
  });
  const [selectedMarker, setSelectedMarker] = useState(null);

  // SETTING NORMAL ROUTE  CORDINATES LAT, LNG
  useEffect(() => {
    let newStopCoordinates = [];
    let newStopPolyLines = [];
    for (let i = 0; i < StopInfo.length; i++) {
      let obj = StopInfo[i];
      // console.log(' lat ' + parseFloat(obj.stopLat) + ' lng ' + parseFloat(obj.stopLong));
      newStopCoordinates.push({
        lat: parseFloat(obj.stopLat),
        lng: parseFloat(obj.stopLong),
        stopName: obj.stopName + `\n${obj.stopStatus == 0 ? 'ETA - ' + obj.eta : 'Stop Reach Time  -' + obj.stopReachTime}`
      });
      newStopPolyLines.push({
        lat: parseFloat(obj.stopLat),
        lng: parseFloat(obj.stopLong)
      });
    }
    setCenter({ lat: parseFloat(StopInfo[0].stopLat), lng: parseFloat(StopInfo[0].stopLong) });
    // console.log(newStopCoordinates);
    setStopsCoordinates(newStopCoordinates);
    // setStopPolyLineCoord(newStopPolyLines);
  }, [StopInfo]);
  // console.log(selectedMarker);

  // SETTING ACTUAL BUS ROUTE  CORDINATES LAT, LNG
  useEffect(() => {
    let newBusCoordinates = [];
    for (let i = 0; i < busInfo?.length; i++) {
      let obj = busInfo[i];
      // console.log(' lat ' + parseFloat(obj.latitude) + ' lng ' + parseFloat(obj.longitude));
      newBusCoordinates.push({
        lat: parseFloat(obj.latitude),
        lng: parseFloat(obj.longitude)
      });
    }

    setBusCoordinates(newBusCoordinates);
  }, [busInfo]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoaded) {
        const directionsServiceObject = new window.google.maps.DirectionsService();
        const directionsRendererObject = new window.google.maps.DirectionsRenderer({ suppressMarkers: true });
        setDirectionsService(directionsServiceObject);
        setDirectionsRenderer(directionsRendererObject);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isLoaded]);
  // Stop route
  useEffect(() => {
    if (StopCoordinates.length > 1) {
      let requestbody;
      let origin = {
        location: {
          latLng: {
            latitude: StopCoordinates[0].lat,
            longitude: StopCoordinates[0].lng
          }
        }
      };
      let destination = {
        location: {
          latLng: {
            latitude: StopCoordinates[StopCoordinates.length - 1].lat,
            longitude: StopCoordinates[StopCoordinates.length - 1].lng
          }
        }
      };
      if (StopCoordinates.length < 2) {
        requestbody = {
          origin: origin,
          destination: destination,
          intermediates: [],
          travelMode: 'DRIVE'
        };
      } else {
        let intermediatesArr = StopCoordinates.slice(1, -1).map((coord) => {
          return {
            location: {
              latLng: {
                latitude: coord.lat,
                longitude: coord.lng
              }
            }
          };
        });
        // console.log(intermediatesArr);
        requestbody = {
          origin: origin,
          destination: destination,
          intermediates: intermediatesArr,
          travelMode: 'DRIVE'
        };
      }
      // console.log(requestbody);
      const header = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': gogdecodeApi,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline,routes.legs.polyline'
      };
      // Api call for to decode and encode --------
      axios
        .post('https://routes.googleapis.com/directions/v2:computeRoutes', requestbody, { headers: header })
        .then((res) => {
          let decode = window.google.maps.geometry?.encoding?.decodePath(res.data.routes[0]?.polyline?.encodedPolyline);
          console.log(decode)
          setStopPolyLineCoord(decode);
        })
        .catch((err) => console.log(err));
      
      // console.log(decodedPath);
      // let decodedPath = window.google.maps.geometry?.encoding?.decodePath(
      //   'az}lDyi}tMaCA{@yAMQb@QxAkC`C{C|KuLJ{]BeBF}@eCeC}@_AsAkAUA[MOUG_@B]N[VOZCTFTRFNvB`BxBpBLi@D}@AoABgGw@N{BHu@ACBA`AIZMHg@EJcAAQQGaCuBHQ~BzBHR@PKbAWp@LNRFTRJZ?^IZST[H[CQKmB|Aq@t@}GbGiG|Fw@x@eClBw@v@uEjFyKrKcExDyH|GwFjFiGbGy@iAiBuB{F{GYU}@gAmEsDg@]UCTBTITDNFr@h@|BtBdDrD~IdKtEkElHkHhCcCjDuCxIkInFgFyHsM[m@oChDgFpGkH`JMGIIsAoBiBeBoC}BiCuBDG|CqFlAuBt@iAxAmCnBaDl@aA~@eBd@q@fEfCbF`J`BvCrBpD\\l@bE`HdHuHpF_FlEaE~FgFjAgAhAwAPOAKuA}@cIoGuNyLgDyC_JoIeDgD_B{AsLcJ_EkCoCyBsBmBaBiA}@cAaCoBuAuAcNeLiKyJcFcEuAiA@UHUJIr@KvGvG~HdH@@tFq@VAxBc@d@Cd@@tKsBHIHB~J_CxGgAzGoA`HaBhAm@z@a@XI`Ca@dKyBzHaBPOpDs@^Ks@{@y@}@QYe@mA_@{Ae@yCIu@SuDQaE@eFOmHKY[[aDcCaSaPIEqFmEcBsAe@g@w@g@SCSMGU@[NWLGr@eB|D{OdAkEzB{Iz@wD~AmGb@uAlB{DxJaRxB{ExE_Jd@mAD]Dw@@wADW@mCSiKAwGGqHAuDF_EGgCiA_Ce@mAsUwRcE{CyGaEiAs@{A}@qBcAsAo@oCaApAyIDcA@mBHo@JYp@gAzAmBbD{EhAgBnFcIrE_HjFsHvG_Kz@uAdFoHnI}LRu@Ck@oBuAkB{AkE_D{CaCyB{AgAo@oBm@iCDiAH{ARsJ`EoF|C_CIOMUY_@yA@_ATm@TY|J{DvAOnBc@d@Ub@Cx@FdAC~AIxAD`BVv@RnBp@bC|AxEnD|BlBR?pAr@LD~BtAdCtBf@DTFrDhDdCtB`@b@XRj@XTFL?RGJKbAaBr@aB~@eBt@kADAbAiBVi@h@o@\\Wh@Wn@Ef@FF@P?bAXdDzApAj@|HfDjAr@hGjCbAPl@AVIH[bCkEvAmCtAqBnBoD~BmEz@iAZUx@e@r@OlAMp@QZOj@c@p@gA`AsBv@M^FTNJV`@tFAf@EN_@^kDSo@DyEAWFa@Vo@l@_@h@uB`EqC|E]XaAfBUpAoCfGw@^i@JmBnCWV[Rk@Ny@b@s@T[B{Aj@o@T[?a@T_BZcAj@a@Ze@h@UNu@To@Ns@`@iA~@b@hAj@r@lEfElE|DDDa@j@~D|DfDdDrQlPnJ|IbHxGbFdCbAv@xDtDfDfD|@nAZ^pAhBfAz@xDvD|AlBlFfHvGlIfH|Jf@?nE`GxC~Cb@x@Pf@PTPLd@r@TK~BgCJ{A?aAqXg^kBgCmB_CS_@M_@~AQjG]zKy@'
      // );
      // setStopPolyLineCoord(decodedPath);

      // directionsService.route(
      //   {
      //     origin: new window.google.maps.LatLng(parseFloat(StopCoordinates[0].lat), parseFloat(StopCoordinates[0].lng)),
      //     destination: new window.google.maps.LatLng(
      //       StopCoordinates[StopCoordinates.length - 1].lat,
      //       StopCoordinates[StopCoordinates.length - 1].lng
      //     ),
      //     waypoints: waypoints,
      //     travelMode: window.google.maps.TravelMode.DRIVING
      //   },
      //   (response, status) => {
      //     console.log(response);
      //     if (status === window.google.maps.DirectionsStatus.OK) {
      //       directionsRenderer.setDirections(response);
      //       directionsRenderer.setOptions({
      //         polylineOptions: {
      //           strokeColor: 'blue', // Change the color here
      //           strokeOpacity: 1.0,
      //           strokeWeight: 2 // Change the color here
      //         }
      //       });
      //       directionsRenderer.setMap(map);
      //     } else {
      //       console.error('Directions request failed:', status);
      //     }
      //   }
      // );
    }
  }, [map, directionsService, directionsRenderer, StopCoordinates, showRoute]);
  // console.log(showBus);
  // console.log('-------------------------------------------------');
  // console.log(BusCoordinates);
  const handleCheckBoxBus = useCallback(() => {
    setShowBus(!showBus);
  }, [showBus]);
  const handleCheckBoxRoute = useCallback(() => {
    setShowRoute(!showRoute);
  }, [showRoute]);
  const onMapLoad = (map) => {
    // console.log(map);
    map.setZoom(10);
    setMap(map);
  };
  if (loadError) {
    return <div>Error loading maps</div>;
  }
  if (!isLoaded) {
    return <div>Loading maps</div>;
  }
  return (
    <div className="h-[100%] w-full flex gap-4">
      <div className="flex justify-center flex-col gap-4 item-center p-3 bg-white w-[70%] rounded-xl">
        <div className="flex justify-between items-center gap-5">
          <div className="flex items-center gap-5">
            <p>
              <button onClick={() => handleClose()}>
                <IconArrowLeft />
              </button>
            </p>
            <p className="text-xl font-semibold">Map</p>
          </div>

          {/* <div className="flex gap-5 text-lg">
            <p className="flex items-center gap-1">
              <input type="checkbox" id="bus" checked={showBus} onChange={() => handleCheckBoxBus()} />{' '}
              <span className="block h-3 w-3 bg-yellow-500"></span>
              <label htmlFor="bus">Bus</label>
            </p>
            <p className="flex items-center gap-1">
              <input type="checkbox" id="Route" checked={showRoute} onChange={() => handleCheckBoxRoute()} />{' '}
              <span className="block h-3 w-3 bg-green-600"></span>
              <label htmlFor="Route">Route</label>
            </p>
          </div> */}

        </div>
        <div style={{ height: '90%', width: '100%' }} className="rounded-xl overflow-hidden flex justify-center items-center">
          {directionsService && directionsRenderer ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={10}
              center={center}
              options={{
                mapTypeId: 'roadmap',
                disableDefaultUI: false,
                options: mapOptions
              }}
              onLoad={onMapLoad}
            >
              {/* Route Polyline */}
              {showRoute && (
                <Polyline
                  path={StopPolyLineCoord}
                  options={{
                    strokeColor: 'green',
                    strokeOpacity: 0.8,
                    strokeWeight: 3
                  }}
                />
              )}
              {/* Render markers for each coordinate */}
              {showRoute && (
                <>
                  {StopCoordinates.map((coord, index, arr) => (
                    <React.Fragment key={index}>
                      <span className="w-fit h-5 ">
                        <Marker
                          key={index}
                          position={coord}
                          onClick={() => setSelectedMarker(coord)}
                          icon={{
                            url: index === 0 ? startpoint : index === arr.length - 1 ? endpoint : reachstop,
                            scaledSize: new window.google.maps.Size(
                              index === 0 || index === arr.length - 1 ? 70 : 15, // Change size for start/end points
                              index === 0 || index === arr.length - 1 ? 70 : 15 // Change size for start/end points
                            )
                          }}
                          title={index === 0 ? 'Start Point' : index === arr.length - 1 ? 'End Point' : `Stop ${coord.stopName}`}
                        />
                      </span>
                    </React.Fragment>
                  ))}

                  <>
                    {' '}
                    {selectedMarker && (
                      <InfoWindow position={selectedMarker} onClick={() => setSelectedMarker(null)}>
                        <p>{selectedMarker.stopName}</p>
                      </InfoWindow>
                    )}
                  </>
                </>
              )}
              <>
                {showBus && (
                  <>
                    <div className="w-fit h-5 ">
                      <Marker
                        position={BusCoordinates[0]}
                        icon={{
                          url: busStart,
                          scaledSize: new window.google.maps.Size(25, 38)
                        }}
                      />
                    </div>
                    <div className="w-fit h-5 ">
                      <Marker
                        position={BusCoordinates[BusCoordinates.length - 1]}
                        icon={{
                          url: busEnd,
                          scaledSize: new window.google.maps.Size(25, 38)
                        }}
                      />
                    </div>
                  </>
                )}
              </>

              {showBus && (
                <Polyline
                  path={BusCoordinates}
                  options={{
                    strokeColor: 'yellow',
                    strokeOpacity: 0.8,
                    strokeWeight: 5
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </div>
      </div>
      <div className="w-[30%] bg-white rounded-xl p-3">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold">Details</h1>
          <div className="flex flex-col gap-4">
            <div className="bg-gray-300 p-2 rounded-xl">
              <h1 className="text-black font-semibold">Select Route</h1>
              <div className="flex flex-col gap-1 mt-1">
                <p className="flex items-center gap-1">
                  <input type="checkbox" id="bus" checked={showBus} onChange={() => handleCheckBoxBus()} />{' '}
                  <span className="block h-3 w-3 bg-yellow-500"></span>
                  <label htmlFor="bus">Route followed by Bus</label>
                </p>
                <p className="flex items-center gap-1">
                  <input type="checkbox" id="Route" checked={showRoute} onChange={() => handleCheckBoxRoute()} />{' '}
                  <span className="block h-3 w-3 bg-green-600"></span>
                  <label htmlFor="Route">Actual Route</label>
                </p>
              </div>
              <div></div>
            </div>
            <div className="bg-gray-300 p-2 rounded-xl">
              <h1 className="text-black font-semibold">Route Details</h1>
              <div className="text-gray-600 mt-1">
                <p>
                  <span>Route No.</span> - <span className="text-gray-800 font-medium">{routeDetails.routeNumber}</span>
                </p>
                <p>
                  <span>Start Point</span> - <span className="text-gray-800 font-medium">{routeDetails.startingPoint}</span>
                </p>
                <p>
                  <span>End Point</span> - <span className="text-gray-800 font-medium">{routeDetails.endPoint}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-300 p-2 rounded-xl">
              <h1 className="text-black  font-semibold">Driver Details</h1>
              <div className="text-gray-500 mt-1">
                <p>
                  <span>Driver Name</span> - <span className="text-gray-800 font-medium">{driverDetails.driverName}</span>
                </p>
                <p>
                  <span>Contact</span> - <span className="text-gray-800 font-medium">{driverDetails.driverContact}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-300 p-2 rounded-xl">
              <h1 className="text-black font-semibold">Bus Details</h1>
              <div className="text-gray-500 mt-1">
                <p>
                  <span>Bus No. </span>- <span className="text-gray-800 font-medium">{busDetails.busNumber}</span>
                </p>
                <p>
                  <span>Reg. Date</span> - <span className="text-gray-800 font-medium">{busDetails.busRegistrationDate}</span>
                </p>
              </div>
            </div>
            {/* busDetails */}
            <div className="bg-gray-300 p-2 rounded-xl">
              <h1 className="text-black  font-semibold">Trip Details</h1>
              <div className="text-gray-500 mt-1">
                <p>
                  <span>Start Time</span>-<span className="text-gray-800 font-medium">{tripDetails.tripStartTime}</span>
                </p>
                <p>
                  <span>End Time</span>-<span className="text-gray-800 font-medium">{tripDetails.tripEndTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
