package com.sliit.crave.service.impl;

import com.sliit.crave.dto.request.feedback.FeedBackResponseRequest;
import com.sliit.crave.dto.request.feedback.FeedbackRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.feedback.FeedbackDTO;
import com.sliit.crave.dto.response.feedback.FeedbackResponseDTO;
import com.sliit.crave.entity.Feedback;
import com.sliit.crave.entity.FeedbackResponse;
import com.sliit.crave.entity.User;
import com.sliit.crave.repo.FeedbackRepository;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.FeedBackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class FeedbackServiceImpl implements FeedBackService {


    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Autowired
    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Response<FeedbackDTO> createFeedback(FeedbackRequest feedbackDto) {
        try {
            // Find the user by the ID from the DTO
            User user = userRepository.findById(feedbackDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Feedback feedback = Feedback.builder()
                    .user(user)
                    .content(feedbackDto.getContent())
                    .rating(feedbackDto.getRating())
                    .build();

            feedback.setUser(user);

            feedback = feedbackRepository.save(feedback);

            FeedbackDTO responseDto = FeedbackDTO.builder()
                    .id(feedback.getId())
                    .authorId(user.getId())
                    .authorName(user.getName())
                    .authorEmail(user.getEmail())
                    .content(feedback.getContent())
                    .rating(feedback.getRating())
                    .build();

            return Response.successResponse("Feedback created successfully", responseDto);

        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        }catch (Exception e) {
            return Response.errorResponse("Failed to create feedback due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<FeedbackDTO>> getAllFeedBacks() {
        try{
            List<Feedback> feedbacks = feedbackRepository.findAll();
            return getListResponse(feedbacks);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve feedbacks: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<FeedbackDTO> getFeedBackById(Long feedBackId) {
        try {
            Feedback feedback = feedbackRepository.findById(feedBackId)
                    .orElseThrow(() -> new RuntimeException("Feedback not found"));

            FeedbackDTO responseDto = FeedbackDTO.builder()
                    .id(feedback.getId())
                    .authorId(feedback.getUser().getId())
                    .authorName(feedback.getUser().getName())
                    .authorEmail(feedback.getUser().getEmail())
                    .content(feedback.getContent())
                    .rating(feedback.getRating())
                    .isResponded(feedback.getResponse() != null)
                    .response(
                            feedback.getResponse() != null ? FeedbackResponseDTO.builder()
                                    .feedbackId(feedback.getResponse().getId())
                                    .authorName(feedback.getResponse().getResponseAuthor())
                                    .responseText(feedback.getResponse().getResponseText())
                                    .createdAt(feedback.getResponse().getCreatedAt())
                                    .build() : null
                    )
                    .build();

            return Response.successResponse("Feedback retrieved successfully", responseDto);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve feedback: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<FeedbackDTO> updateFeedback(Long id, FeedbackRequest feedbackDto) {
        try {
            Feedback existing = feedbackRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Feedback not found"));

            if (feedbackDto.getContent() != null && !feedbackDto.getContent().isEmpty()) {
                existing.setContent(feedbackDto.getContent());
            }

            if (feedbackDto.getRating() != 0) {
                existing.setRating(feedbackDto.getRating());
            }

            Feedback updated = feedbackRepository.save(existing);

            FeedbackDTO responseDto = FeedbackDTO.builder()
                    .id(updated.getId())
                    .authorId(updated.getUser().getId())
                    .authorName(updated.getUser().getName())
                    .authorEmail(updated.getUser().getEmail())
                    .content(updated.getContent())
                    .rating(updated.getRating())
                    .build();

            return Response.successResponse("Feedback updated successfully", responseDto);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return Response.errorResponse("Failed to update feedback: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<Void> deleteFeedback(Long feedBackId) {
         try {
              Feedback feedback = feedbackRepository.findById(feedBackId).orElse(null);
              if (feedback == null) {
                return Response.errorResponse("Feedback not found");
              }

              feedbackRepository.delete(feedback);
              return Response.successResponse("Feedback deleted successfully", null);
         } catch (Exception e) {
                  return Response.errorResponse("Failed to delete feedback: " + e.getMessage());
         }
    }

    @Override
    public Response<FeedbackResponseDTO> addResponse(Long feedbackId, FeedBackResponseRequest request) {
        try {
            Feedback feedback = feedbackRepository.findById(feedbackId)
                    .orElseThrow(() -> new RuntimeException("Feedback not found"));

            // prevent duplicate responses
            if (feedback.getResponse() != null) {
                throw new RuntimeException("Feedback already has a response");
            }

            FeedbackResponse feedbackResponse = FeedbackResponse.builder()
                    .responseText(request.getResponseText())
                    .responseAuthor("Admin") // optional, defaults to "Admin"
                    .feedback(feedback)
                    .build();

            feedback.setResponse(feedbackResponse);

            // save using the repository that owns cascade (either one works)
            feedbackRepository.save(feedback);
            // OR: feedbackResponseRepository.save(feedbackResponse);

            FeedbackResponseDTO responseDto = FeedbackResponseDTO.builder()
                    .id(feedbackResponse.getId()) // ✅ correct response ID
                    .feedbackId(feedback.getId())
                    .responseText(feedbackResponse.getResponseText())
                    .authorName(feedbackResponse.getResponseAuthor())
                    .createdAt(feedbackResponse.getCreatedAt())
                    .build();

            return Response.successResponse("Response added successfully", responseDto);

        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return Response.errorResponse("Failed to add response: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<FeedbackDTO>> getFeedBacksByUserId(Long userId) {
        try {
            List<Feedback> feedbacks = feedbackRepository.findByUserId(userId);
            return getListResponse(feedbacks);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve feedbacks: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Response<List<FeedbackDTO>> getListResponse(List<Feedback> feedbacks) {
        List<FeedbackDTO> feedbackResponses = feedbacks.stream()
                .map(feedback -> FeedbackDTO.builder()
                        .id(feedback.getId())
                        .authorId(feedback.getUser().getId())
                        .authorName(feedback.getUser().getName())
                        .authorEmail(feedback.getUser().getEmail())
                        .content(feedback.getContent())
                        .rating(feedback.getRating())
                        .createdAt(feedback.getSubmittedDate())
                        .isResponded(feedback.getResponse() != null)
                        .response(
                                feedback.getResponse() != null ? FeedbackResponseDTO.builder()
                                        .feedbackId(feedback.getResponse().getId())
                                        .authorName(feedback.getResponse().getResponseAuthor())
                                        .responseText(feedback.getResponse().getResponseText())
                                        .createdAt(feedback.getResponse().getCreatedAt())
                                        .build() : null
                        )
                        .build())
                .toList();
        return Response.successResponse("Feedbacks retrieved successfully", feedbackResponses);
    }


}