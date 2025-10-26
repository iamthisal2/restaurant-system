package com.sliit.crave.service;

import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.user.UserResponse;


public interface UserService {
    Response<UserResponse> getMe(Long userId);
}
