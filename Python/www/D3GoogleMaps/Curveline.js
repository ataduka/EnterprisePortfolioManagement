function drawCurvedLine(startLatLng, endLatLng, offset, right, left, lineColor) {
    var midLoc = getMidPoint(startLatLng, endLatLng);// Get the mid point of the start and end LatLngs
    var midLoc1 = getMidPoint(startLatLng, midLoc);// Get the mid point of the start LatLng and mid LatLng
    var midLoc2 = getMidPoint(midLoc, endLatLng);// Get the mid point of the mid LatLng and end LatLng
    var heading = google.maps.geometry.spherical.computeHeading(startLatLng, endLatLng);// Compute the heading of the start and end LatLngs

    // Change the heading based on right or left value 
    var headingOffset;
    if (right == 1 && left == 0) {
        headingOffset = 90;
    }
    else if (right == 0 && left == 1) {
        headingOffset = -90;
    }

    var offsetLoc = google.maps.geometry.spherical.computeOffset(midLoc, offset / 1.5, heading + headingOffset);// Get the offset location of the mid point of start and end LatLngs
    var offsetLoc1 = google.maps.geometry.spherical.computeOffset(midLoc1, offset / 2, heading + headingOffset);// Get the offset location of the mid point of midLoc and start LatLng    
    var offsetLoc2 = google.maps.geometry.spherical.computeOffset(midLoc2, offset / 2, heading + headingOffset);// Get the offset location of the mid point of midLoc and start LatLng

    // Draw poly line along above computed locations
    var curve = new google.maps.Polyline({
        path: [startLatLng, offsetLoc1, offsetLoc, offsetLoc2, endLatLng],
        geodesic: true,
        strokeColor: lineColor,
        strokeOpacity: 0.6,
        strokeWeight: 7
    });

    curve.setMap(map);

    // Add an arrow to the end of the curved line
    var arrow = new google.maps.Marker({
        position: newLoc,
        map: map,
        icon: {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            scale: 4,
            strokeColor: lineColor,
            strokeOpacity: 1,
            strokeWeight: 5.0,
            fillColor: 'transparent',
            fillOpacity: 0.6,
            rotation: google.maps.geometry.spherical.computeHeading(offsetLoc2, endLatLng)
        },
    });

}