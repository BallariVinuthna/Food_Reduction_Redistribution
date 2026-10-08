package com.foodredistribution.service;

import com.foodredistribution.dto.*;
import com.foodredistribution.entity.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.repository.*;
import com.foodredistribution.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final FoodProviderRepository foodProviderRepository;
    private final ReceiverRepository receiverRepository;
    private final VolunteerRepository volunteerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       FoodProviderRepository foodProviderRepository,
                       ReceiverRepository receiverRepository,
                       VolunteerRepository volunteerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       AuthenticationManager authenticationManager,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.foodProviderRepository = foodProviderRepository;
        this.receiverRepository = receiverRepository;
        this.volunteerRepository = volunteerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already registered: " + req.getEmail());
        }

        User user = new User(
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getFullName(),
                req.getPhone(),
                req.getRole()
        );
        user = userRepository.save(user);

        UUID profileId = null;
        if (req.getRole() == Role.FOOD_PROVIDER) {
            FoodProvider provider = new FoodProvider(
                    user,
                    req.getOrganizationName() != null ? req.getOrganizationName() : req.getFullName(),
                    req.getOrganizationType() != null ? req.getOrganizationType() : "RESTAURANT",
                    req.getAddress() != null ? req.getAddress() : "Hyderabad, Telangana",
                    req.getLatitude() != null ? req.getLatitude() : 17.3850,
                    req.getLongitude() != null ? req.getLongitude() : 78.4867,
                    req.getFullName(),
                    req.getPhone()
            );
            provider = foodProviderRepository.save(provider);
            profileId = provider.getId();
        } else if (req.getRole() == Role.NGO_RECEIVER) {
            Receiver receiver = new Receiver(
                    user,
                    req.getOrganizationName() != null ? req.getOrganizationName() : req.getFullName(),
                    req.getOrganizationType() != null ? req.getOrganizationType() : "NGO",
                    req.getAddress() != null ? req.getAddress() : "Hyderabad, Telangana",
                    req.getLatitude() != null ? req.getLatitude() : 17.3850,
                    req.getLongitude() != null ? req.getLongitude() : 78.4867,
                    req.getFullName(),
                    req.getPhone(),
                    req.getCapacityMeals() != null ? req.getCapacityMeals() : 100,
                    "ANY"
            );
            receiver = receiverRepository.save(receiver);
            profileId = receiver.getId();
        } else if (req.getRole() == Role.VOLUNTEER) {
            Volunteer volunteer = new Volunteer(
                    user,
                    req.getFullName(),
                    req.getPhone(),
                    req.getVehicleType() != null ? req.getVehicleType() : "TWO_WHEELER",
                    req.getLatitude() != null ? req.getLatitude() : 17.3850,
                    req.getLongitude() != null ? req.getLongitude() : 78.4867
            );
            volunteer = volunteerRepository.save(volunteer);
            profileId = volunteer.getId();
        }

        auditService.log(user.getEmail(), "REGISTER", "User", user.getId().toString(), "Registered with role " + user.getRole());

        return createAuthResponse(user, profileId);
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + req.getEmail()));

        UUID profileId = getProfileIdForUser(user);
        auditService.log(user.getEmail(), "LOGIN", "User", user.getId().toString(), "User logged in successfully");

        return createAuthResponse(user, profileId);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }
        String email = jwtUtils.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        UUID profileId = getProfileIdForUser(user);
        return createAuthResponse(user, profileId);
    }

    public UserDto getCurrentUserDto(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        UUID profileId = getProfileIdForUser(user);
        return buildUserDto(user, profileId);
    }

    private UUID getProfileIdForUser(User user) {
        if (user.getRole() == Role.FOOD_PROVIDER) {
            return foodProviderRepository.findByUser(user).map(FoodProvider::getId).orElse(null);
        } else if (user.getRole() == Role.NGO_RECEIVER) {
            return receiverRepository.findByUser(user).map(Receiver::getId).orElse(null);
        } else if (user.getRole() == Role.VOLUNTEER) {
            return volunteerRepository.findByUser(user).map(Volunteer::getId).orElse(null);
        }
        return null;
    }

    private AuthResponse createAuthResponse(User user, UUID profileId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId().toString());
        if (profileId != null) {
            claims.put("profileId", profileId.toString());
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), claims);
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        UserDto userDto = buildUserDto(user, profileId);
        return new AuthResponse(token, refreshToken, userDto);
    }

    private UserDto buildUserDto(User user, UUID profileId) {
        UserDto dto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(), user.getRole());
        dto.setProfileId(profileId);

        if (user.getRole() == Role.FOOD_PROVIDER) {
            foodProviderRepository.findByUser(user).ifPresent(p -> {
                dto.setOrganizationName(p.getOrganizationName());
                dto.setAddress(p.getAddress());
                dto.setLatitude(p.getLatitude());
                dto.setLongitude(p.getLongitude());
            });
        } else if (user.getRole() == Role.NGO_RECEIVER) {
            receiverRepository.findByUser(user).ifPresent(r -> {
                dto.setOrganizationName(r.getOrganizationName());
                dto.setAddress(r.getAddress());
                dto.setLatitude(r.getLatitude());
                dto.setLongitude(r.getLongitude());
            });
        }
        return dto;
    }
}
