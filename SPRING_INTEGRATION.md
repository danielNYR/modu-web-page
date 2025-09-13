# Spring Boot Integration Guide

This document provides instructions for integrating the contact form with a Spring Boot application.

## Spring Boot Backend Setup

### 1. Dependencies

Add these dependencies to your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
</dependencies>
```

### 2. CORS Configuration

Create a CORS configuration to allow requests from your frontend:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "https://yourdomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. Contact Form Model

```java
@Entity
@Table(name = "contact_submissions")
public class ContactSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50)
    @Column(name = "first_name")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50)
    @Column(name = "last_name")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email")
    @Size(max = 100)
    private String email;
    
    @Size(max = 100)
    private String company;
    
    @Size(max = 20)
    private String phone;
    
    @Size(max = 50)
    private String service;
    
    @Size(max = 50)
    private String budget;
    
    @Size(max = 50)
    private String timeline;
    
    @NotBlank(message = "Message is required")
    @Size(max = 2000)
    private String message;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "source")
    private String source;
    
    @Column(name = "status")
    private String status = "NEW";
    
    // Constructors, getters, and setters
    public ContactSubmission() {
        this.createdAt = LocalDateTime.now();
    }
    
    // ... getters and setters
}
```

### 4. Repository

```java
@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    
    List<ContactSubmission> findByStatusOrderByCreatedAtDesc(String status);
    
    List<ContactSubmission> findByEmailContainingIgnoreCase(String email);
    
    @Query("SELECT c FROM ContactSubmission c WHERE c.createdAt >= :fromDate")
    List<ContactSubmission> findSubmissionsFromDate(@Param("fromDate") LocalDateTime fromDate);
}
```

### 5. Service

```java
@Service
@Transactional
public class ContactService {
    
    private final ContactSubmissionRepository repository;
    private final EmailService emailService;
    
    public ContactService(ContactSubmissionRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }
    
    public ContactSubmission saveContactSubmission(ContactSubmission submission) {
        // Save to database
        ContactSubmission saved = repository.save(submission);
        
        // Send notification email
        try {
            emailService.sendContactNotification(saved);
        } catch (Exception e) {
            // Log error but don't fail the request
            log.error("Failed to send email notification for contact submission {}", saved.getId(), e);
        }
        
        return saved;
    }
    
    public List<ContactSubmission> getAllSubmissions() {
        return repository.findAll();
    }
    
    public List<ContactSubmission> getSubmissionsByStatus(String status) {
        return repository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public ContactSubmission updateStatus(Long id, String status) {
        ContactSubmission submission = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Contact submission not found"));
        submission.setStatus(status);
        return repository.save(submission);
    }
}
```

### 6. Controller

```java
@RestController
@RequestMapping("/api")
@Slf4j
public class ContactController {
    
    private final ContactService contactService;
    
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }
    
    @PostMapping("/contact")
    public ResponseEntity<Map<String, Object>> submitContactForm(
            @Valid @RequestBody ContactSubmission submission,
            BindingResult bindingResult) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .collect(Collectors.toList());
                
                response.put("success", false);
                response.put("message", "Validation failed");
                response.put("errors", errors);
                return ResponseEntity.badRequest().body(response);
            }
            
            // Save the submission
            ContactSubmission saved = contactService.saveContactSubmission(submission);
            
            response.put("success", true);
            response.put("message", "Thank you for your message! We'll get back to you soon.");
            response.put("submissionId", saved.getId());
            
            log.info("Contact form submitted successfully: {}", saved.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error processing contact form submission", e);
            
            response.put("success", false);
            response.put("message", "An error occurred while processing your request. Please try again.");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/contact/submissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactSubmission>> getAllSubmissions() {
        List<ContactSubmission> submissions = contactService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }
    
    @PutMapping("/contact/submissions/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactSubmission> updateSubmissionStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        ContactSubmission updated = contactService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }
}
```

### 7. Email Service

```java
@Service
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.email.from:noreply@modu.com}")
    private String fromEmail;
    
    @Value("${app.email.admin:admin@modu.com}")
    private String adminEmail;
    
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    
    public void sendContactNotification(ContactSubmission submission) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("New Contact Form Submission - " + submission.getFirstName() + " " + submission.getLastName());
            
            String htmlContent = buildEmailContent(submission);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email notification", e);
        }
    }
    
    private String buildEmailContent(ContactSubmission submission) {
        return String.format("""
            <html>
            <body>
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> %s %s</p>
                <p><strong>Email:</strong> %s</p>
                <p><strong>Company:</strong> %s</p>
                <p><strong>Phone:</strong> %s</p>
                <p><strong>Service Interest:</strong> %s</p>
                <p><strong>Budget:</strong> %s</p>
                <p><strong>Timeline:</strong> %s</p>
                <p><strong>Message:</strong></p>
                <p>%s</p>
                <p><strong>Submitted:</strong> %s</p>
            </body>
            </html>
            """,
            submission.getFirstName(),
            submission.getLastName(),
            submission.getEmail(),
            submission.getCompany() != null ? submission.getCompany() : "Not provided",
            submission.getPhone() != null ? submission.getPhone() : "Not provided",
            submission.getService() != null ? submission.getService() : "Not specified",
            submission.getBudget() != null ? submission.getBudget() : "Not specified",
            submission.getTimeline() != null ? submission.getTimeline() : "Not specified",
            submission.getMessage(),
            submission.getCreatedAt()
        );
    }
}
```

### 8. Application Properties

Add these properties to your `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb  # Use your preferred database
    driver-class-name: org.h2.Driver
    username: sa
    password: password
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    
  mail:
    host: smtp.gmail.com  # Use your SMTP server
    port: 587
    username: ${MAIL_USERNAME:your-email@gmail.com}
    password: ${MAIL_PASSWORD:your-app-password}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  email:
    from: noreply@modu.com
    admin: admin@modu.com

server:
  port: 8080
```

## Frontend Configuration

Update the JavaScript configuration in `assets/js/main.js`:

```javascript
const CONFIG = {
    // Update this to your Spring application URL
    API_BASE_URL: 'http://localhost:8080/api',
    CONTACT_ENDPOINT: '/contact',
    CORS_MODE: 'cors',
    REQUEST_TIMEOUT: 10000
};
```

## Testing the Integration

1. Start your Spring Boot application
2. Open the webpage in a browser
3. Fill out the contact form
4. Check the browser console for any errors
5. Verify the submission is saved in the database
6. Check that notification emails are sent

## Security Considerations

1. **Input Validation**: Always validate input on both frontend and backend
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **CSRF Protection**: Consider CSRF tokens for additional security
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Store sensitive configuration in environment variables

## Deployment

For production deployment:

1. Update CORS origins to your production domain
2. Use a production database (PostgreSQL, MySQL, etc.)
3. Configure proper SMTP settings
4. Set up proper logging and monitoring
5. Use environment variables for sensitive data