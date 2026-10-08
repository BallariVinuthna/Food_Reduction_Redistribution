package com.foodredistribution.controller;

import com.foodredistribution.dto.ApiResponse;
import com.foodredistribution.entity.Receiver;
import com.foodredistribution.matching.MatchingEngine;
import com.foodredistribution.repository.ReceiverRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/receivers")
public class ReceiverController {

    private final ReceiverRepository receiverRepository;

    public ReceiverController(ReceiverRepository receiverRepository) {
        this.receiverRepository = receiverRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Receiver>>> getAllReceivers() {
        return ResponseEntity.ok(ApiResponse.ok(receiverRepository.findAll()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNearbyReceivers(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "20.0") double radiusKm) {

        List<Receiver> all = receiverRepository.findByIsAvailableTrue();
        List<Map<String, Object>> nearby = new ArrayList<>();

        for (Receiver r : all) {
            double dist = MatchingEngine.calculateHaversineDistance(lat, lon, r.getLatitude(), r.getLongitude());
            if (dist <= radiusKm) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("organizationName", r.getOrganizationName());
                map.put("organizationType", r.getOrganizationType());
                map.put("address", r.getAddress());
                map.put("latitude", r.getLatitude());
                map.put("longitude", r.getLongitude());
                map.put("distanceKm", Math.round(dist * 10.0) / 10.0);
                map.put("capacityMeals", r.getCapacityMeals());
                map.put("reliabilityScore", r.getReliabilityScore());
                map.put("dietaryPreference", r.getDietaryPreference());
                nearby.add(map);
            }
        }

        nearby.sort(Comparator.comparingDouble(m -> (Double) m.get("distanceKm")));
        return ResponseEntity.ok(ApiResponse.ok(nearby));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Receiver>> getReceiverById(@PathVariable UUID id) {
        return receiverRepository.findById(id)
                .map(r -> ResponseEntity.ok(ApiResponse.ok(r)))
                .orElse(ResponseEntity.notFound().build());
    }
}
