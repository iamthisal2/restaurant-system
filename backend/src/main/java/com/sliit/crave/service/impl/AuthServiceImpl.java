package com.sliit.crave.service.impl;



import com.sliit.crave.config.JwtService;
import com.sliit.crave.dto.request.auth.LoginRequest;
import com.sliit.crave.dto.request.auth.UpdateRegisterRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.auth.LoginResponse;
import com.sliit.crave.dto.response.auth.RegisterResponse;
import com.sliit.crave.entity.User;
import com.sliit.crave.enums.Role;
import com.sliit.crave.exception.InvalidCredentialsException;
import com.sliit.crave.exception.UserAlreadyExistException;
import com.sliit.crave.exception.UserNotFoundException;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public Response<RegisterResponse> register(UpdateRegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistException(request.getEmail());
            }

            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .name(request.getName())
                    .role(Role.USER)
                    .build();

            userRepository.save(user);

            return Response.successResponse(
                    "User Registered Successfully",
                    RegisterResponse.builder().name(user.getName())
                            .email(user.getEmail()).build());

        } catch (Exception e) {
            log.error(e.getMessage());
           return Response.errorResponse(e.getMessage());
        }
    }

    @Override
    public Response<LoginResponse> login(LoginRequest request) {
        try {

            if(request.getEmail() == null || request.getPassword() == null) {
                throw new RuntimeException("Email or password is null");
            }

            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

            if(user.isDisabled()) {
                throw new RuntimeException("User account is disabled. Please contact support.");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new InvalidCredentialsException();
            }
            String authToken = jwtService.generateToken(request.getEmail());

            LoginResponse response = LoginResponse.builder()
                    .authToken(authToken)
                    .user(
                            LoginResponse.UserData.builder()
                                    .id(user.getId())
                                    .name(user.getName())
                                    .email(user.getEmail())
                                    .role(user.getRole().name())
                                    .build()
                    )
                    .build();

            return Response.successResponse("User successfully logged in", response);

        }catch (InvalidCredentialsException | UserNotFoundException e){
            log.error(e.getMessage());
            return Response.errorResponse(e.getMessage());
        } catch (RuntimeException e){
            log.error(e.getMessage());
            return Response.errorResponse(e.getMessage());
        }catch (Exception e){
            log.error(e.getMessage());
            return Response.errorResponse("Error occurred while logging in", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
