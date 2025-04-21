import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import {
  IconArrowLeft,
  IconPlaystationCircle,
  IconClock,
  IconDeviceMobileCharging,
  IconBus,
  IconBrandSpeedtest
} from '@tabler/icons-react';
import { BackendUrl } from 'utils/config';
import startpoint from './startpoint.png';
import endpoint from './endpoint.png';
import unreachstop from './stops.png';
import reachstop from './reachstop.png';
const gogSecretApi = process.env.REACT_APP_GOOGLE_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const vehicleIcon = {
  url: 'http://maps.google.com/mapfiles/ms/icons/bus.png'
};

export const mapOptions = {
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

// const StopMarker = ({ position, stopName }) => {
//   console.log(position);
//   return (
//     <div
//       style={{
//         position: 'absolute',
//         top: position.y - 30, // Adjust position as needed
//         left: position.x - 70, // Adjust position as needed
//         backgroundColor: 'cream',
//         border: '1px solid black',
//         borderRadius: '5px',
//         padding: '5px'
//       }}
//     >
//       {stopName}
//     </div>
//   );
// };

export const MapTracking = ({ busId, tripId, tripDate, routeId, showModal, closeMapTracking }) => {
  // console.log(busId,/route)
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  // console.log(showModal, closeMapTracking );
  const [center, setCenter] = useState({});
  const [map, setMap] = useState(null);
  const [vehicleCoordinates, setVehicleCoordinates] = useState({});
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [busInfo, setBusInfo] = useState({});
  const [StopInfo, setStopInfo] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: gogSecretApi ?? '',
    libraries
  });

  const fetchCoordinatesFromAPI = async () => {
    try {
      const response = await axios.post(`${BackendUrl}/app/v1/tripstatus/userTrack`, {
        busId: busId,
        routeId: routeId,
        tripId: tripId,
        tripDate: tripDate
      });
      console.log(parseFloat(response.data.busTrackingData.latitude), parseFloat(response.data.busTrackingData.longitude));
      setBusInfo(response.data.busTrackingData);
      setVehicleCoordinates({
        lat: parseFloat(response.data.busTrackingData.latitude),
        lng: parseFloat(response.data.busTrackingData.longitude)
      });
      // let newRouteCoordinates = [];
      // for (let i = 0; i < response.data.stopsData.stops.length; i++) {
      //   let obj = response.data.stopsData.stops[i];
      //   // console.log(' lat ' + parseFloat(obj.stopLat) + ' lng ' + parseFloat(obj.stopLong));
      //   newRouteCoordinates.push({
      //     lat: parseFloat(obj.stopLat),
      //     lng: parseFloat(obj.stopLong),
      //     stopName: obj.stopName + `\n${obj.stopStatus == 0 ? 'ETA - ' + obj.eta : 'Stop Reach Time  -' + obj.stopReachTime}`
      //   });
      // }
      // if(count==0){
      //   console.log("worked ")
      //   console.log(count);
      //   setCenter({ lat: parseFloat(response.data.stopsData.stops[0].stopLat), lng: parseFloat(response.data.stopsData.stops[0].stopLong) });
      //   // console.log(response.data);
      // setStopInfo(response.data.stopsData.stops);
      //   setBusInfo(response.data.busTrackingData);
      //   setRouteCoordinates(newRouteCoordinates);
      // }
      // setCount(1);
    } catch (error) {
      console.log(error);
    }
  };

  const tempFunction = async () => {
    try {
      const response = await axios.post(`${BackendUrl}/app/v1/tripstatus/userTrack`, {
        busId: busId,
        routeId: routeId,
        tripId: tripId,
        tripDate: tripDate
      });

      let newRouteCoordinates = [];
      for (let i = 0; i < response.data.stopsData.stops?.length; i++) {
        let obj = response.data.stopsData.stops[i];
        // console.log(' lat ' + parseFloat(obj.stopLat) + ' lng ' + parseFloat(obj.stopLong));
        newRouteCoordinates.push({
          lat: parseFloat(obj.stopLat),
          lng: parseFloat(obj.stopLong),
          stopName: obj.stopName + `\n${obj.stopStatus == 0 ? 'ETA - ' + obj.eta : 'Stop Reach Time  -' + obj.stopReachTime}`
        });
      }
      setCenter({ lat: parseFloat(response.data.stopsData.stops[0].stopLat), lng: parseFloat(response.data.stopsData.stops[0].stopLong) });
      // console.log(response.data);
      setStopInfo(response.data.stopsData.stops);
      setBusInfo(response.data.busTrackingData);
      setRouteCoordinates(newRouteCoordinates);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    tempFunction();
    fetchCoordinatesFromAPI();
    const timeout = setTimeout(() => {
      if (isLoaded) {
        const directionsServiceObject = new window.google.maps.DirectionsService();
        const directionsRendererObject = new window.google.maps.DirectionsRenderer({
          suppressMarkers: true // Suppress default markers
        });
        setDirectionsService(directionsServiceObject);
        setDirectionsRenderer(directionsRendererObject);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // Api call on every 10s
  useEffect(() => {
    setInterval(() => {
      fetchCoordinatesFromAPI();
      console.log('Api hit');
    }, 10000);
  }, []);
  useEffect(() => {
    if (map && directionsService && directionsRenderer) {
      const waypoints = routeCoordinates.slice(1, -1).map((coord) => ({
        location: new window.google.maps.LatLng(coord.lat, coord.lng),
        stopover: true
      }));

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(parseFloat(routeCoordinates[0].lat), parseFloat(routeCoordinates[0].lng)),
          destination: new window.google.maps.LatLng(
            routeCoordinates[routeCoordinates.length - 1].lat,
            routeCoordinates[routeCoordinates.length - 1].lng
          ),
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
            directionsRenderer.setOptions({
              polylineOptions: {
                strokeColor: 'blue'
              }
            });
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
      directionsRenderer.setMap(null); // Clear previous route
      directionsRenderer.setMap(map); // Set map for new route
    }
  }, [map, directionsService, directionsRenderer, routeCoordinates]);

  const onMapLoad = (map) => {
    // console.log('map', map);
    // map.setCenter(center);
    map.setZoom(8);
    setMap(map);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="flex h-[100%] w-[100%] absolute z-0 max-md:flex-col gap-5 overflow-x-hidden overflow-hidden max-md:overflow-y-scroll bg-gray-200 p-2">
      {/* Map */}
      <div className="w-4/6 h-[100%] flex flex-col gap-3 p-5 bg-white rounded-xl">
        <div className="p-2 flex justify-between">
          <p className="flex gap-3">
            <button onClick={() => closeMapTracking()}>
              {' '}
              <IconArrowLeft />
            </button>{' '}
            <span className="text-xl font-semibold">Map</span>
          </p>
          <div className="flex gap-2">
            <p className="flex gap-1">
              <img src={unreachstop} alt="Aaveg" className="h-4" />
              <span> UnReached stop</span>
            </p>
            <p className="flex gap-1">
              <img src={reachstop} alt="Aaveg" className="h-4" />
              <span> Reached stop</span>
            </p>
          </div>
        </div>

        <div className="w-full h-[90%] relative max-md:w-[100%] max-md:h-96 rounded-xl overflow-hidden">
          {/*  */}

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
              // options={mapOptions}
            >
              {/* Render markers for each coordinate */}
              {routeCoordinates.map((coord, index, arr) => (
                <React.Fragment key={index}>
                  <div className="w-fit h-10 bg-red-800">
                    <Marker
                      key={index}
                      position={coord}
                      icon={{
                        url:
                          index === 0
                            ? startpoint
                            : index === arr.length - 1
                            ? endpoint
                            : StopInfo[index].stopReachTime == 1
                            ? reachstop
                            : StopInfo[index].stopReachTime == 0
                            ? unreachstop
                            : reachstop,
                        scaledSize: new window.google.maps.Size(
                          index === 0 || index === arr.length - 1 ? 70 : 15, // Change size for start/end points
                          index === 0 || index === arr.length - 1 ? 70 : 15 // Change size for start/end points
                        )
                      }}
                      title={index === 0 ? 'Start Point' : index === arr.length - 1 ? 'End Point' : `Stop ${coord.stopName}`}
                    >
                      <InfoWindow position={coord}>
                        <h2>{coord.stopName}</h2>
                      </InfoWindow>
                    </Marker>
                  </div>

                  {/* <StopMarker position={map.getProjection().fromLatLngToPoint(coord)} stopName={coord.stopName} /> */}
                </React.Fragment>
              ))}

              {/* Render vehicle marker - The vehicle lat lng will be dynamic and will come by a continuous api call  */}

              <Marker position={vehicleCoordinates} icon={vehicleIcon} />
            </GoogleMap>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <div>
                <p className="h-10 w-10 border-2 rounded-full border-t-blue-700 animate-spin"></p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Details */}
      <div className="w-2/6 h-full max-md:w-[100%]  ">
        <div className="bg-white rounded-xl p-5 flex flex-col gap-2">
          <div>
            <h1 className="text-2xl font-semibold">Details</h1>
          </div>
          <div className=" bg-gray-200 rounded-xl p-4">
            <h1 className="text-lg font-semibold mb-1">Bus Details</h1>
            <div className="flex flex-col gap-1">
              <p className="flex items-center gap-2">
                <span className="text-gray-500 flex items-center gap-1">
                  {' '}
                  <IconBus className="h-5" />
                  Bus No -{' '}
                </span>
                <span className=" text-md uppercase text-black font-medium">{busInfo.name || 'Not Yet'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-500 flex items-center gap-1">
                  <IconBrandSpeedtest className="h-5" />
                  Speed -{' '}
                </span>
                <span className="font-medium text-md text-black">{Math.floor(busInfo.speed).toFixed(2) || 'Not Yet'} Km/hr</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-700 flex items-center ">
                  {' '}
                  <IconDeviceMobileCharging className="h-5" />
                  BatteryLevel -{' '}
                </span>{' '}
                <span className="font-medium text-md text-black">{busInfo.batteryLevel || 'Not Yet'} %</span>
              </p>
            </div>
          </div>

          {/* Stop Details */}
          <div className="h-full grid grid-cols-1 gap-2  bg-gray-200 rounded-xl p-4">
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">Stops Detail</h1>
              <div>
                <p className="flex ">
                  <span>
                    {' '}
                    <IconPlaystationCircle className="text-green-500 h-4" />
                  </span>
                  <span> Reached Stops</span>
                </p>
                <p className="flex">
                  <span>
                    {' '}
                    <IconPlaystationCircle className="text-gray-500 h-4" />
                  </span>{' '}
                  <span>UnReached Stops</span>
                </p>
              </div>
            </div>

            <div className="h-72 overflow-y-scroll grid grid-cols-1 gap-1">
              <div className={` p-2 flex justify-between`}>
                <p className="flex gap-1">Stop Name</p>
                <p className="text-sm flex items-center">
                  <IconClock className="text-[#777] h-3" />
                  ETA
                </p>
              </div>
              {StopInfo.map((item, i) => {
                return (
                  <div key={i} className={` flex justify-between`}>
                    <p className="flex gap-1">
                      <span>
                        <IconPlaystationCircle className={`${item.stopStatus == 1 ? 'text-green-500 h-4' : 'text-gray-500 h-4'}`} />
                      </span>
                      <span className="text-black">{item.stopName}</span>
                    </p>

                    <p>{item.stopStatus == 0 ? <span>{item.eta}</span> : <span>{item.stopReachTime}</span>}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//
