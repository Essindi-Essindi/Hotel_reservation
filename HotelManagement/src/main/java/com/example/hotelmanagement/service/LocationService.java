package com.example.hotelmanagement.service;

import com.example.hotelmanagement.model.Location;
import com.example.hotelmanagement.repository.LocationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepo locationRepo;

    public List<Location> getAllLocations() {
        return locationRepo.findAll();
    }

    public Location getLocationById(Integer locationId) {
        return locationRepo.findById(locationId).orElse(null);
    }

    public Location getLocationByName(String locationName) {
        return locationRepo.findByLocationName(locationName);
    }

    public Location createLocation(String locationName) {
        Location location = new Location();
        location.setLocationName(locationName);
        
        return locationRepo.save(location);
    }

    public Location updateLocation(Location location) {
        Location existingLocation = locationRepo.findById(location.getLocationId()).get();
        existingLocation.setLocationName(location.getLocationName() != null ? location.getLocationName() : existingLocation.getLocationName());
        return locationRepo.save(existingLocation);
    }

    public void deleteLocation(Integer locationId) {
        locationRepo.deleteById(locationId);
    }
}
