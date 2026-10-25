package com.nexora.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nexora.api.model.StudentRecord;
import com.nexora.api.repository.StudentRecordRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
public class StudentDataService {
    private final StudentRecordRepository repository;
    private final ObjectMapper mapper;
    private List<JsonNode> faculty = new ArrayList<>();

    public StudentDataService(StudentRecordRepository repository, ObjectMapper mapper) {
        this.repository = repository; this.mapper = mapper;
    }

    @PostConstruct
    public void seedIfEmpty() throws Exception {
        try (InputStream in = new ClassPathResource("seed/faculty.json").getInputStream()) {
            faculty = mapper.readValue(in, mapper.getTypeFactory().constructCollectionType(List.class, JsonNode.class));
        }
        if (repository.count() == 0) {
            try (InputStream in = new ClassPathResource("seed/students.json").getInputStream()) {
                List<JsonNode> records = mapper.readValue(in, mapper.getTypeFactory().constructCollectionType(List.class, JsonNode.class));
                for (JsonNode n : records) repository.save(toEntity(n));
            }
        }
    }

    private StudentRecord toEntity(JsonNode n) throws Exception {
        StudentRecord r = new StudentRecord();
        r.setId(n.path("id").asText()); r.setName(n.path("name").asText());
        r.setRegisterNumber(n.path("registerNumber").asText()); r.setEmail(n.path("email").asText());
        r.setYearLevel(n.path("year").asInt()); r.setSectionName(n.path("section").asText());
        r.setTotalSolved(n.path("codingStats").path("totalSolved").asInt()); r.setProfileJson(mapper.writeValueAsString(n));
        return r;
    }

    public List<JsonNode> all() {
        List<JsonNode> out = new ArrayList<>();
        for (StudentRecord r : repository.findAll()) out.add(parse(r));
        return out;
    }
    public JsonNode get(String id) { return repository.findById(id).map(this::parse).orElse(null); }
    public StudentRecord entity(String id) { return repository.findById(id).orElse(null); }
    public JsonNode parse(StudentRecord r) { try { return mapper.readTree(r.getProfileJson()); } catch (Exception e) { throw new IllegalStateException(e); } }
    public void saveProfile(JsonNode n) {
        try {
            StudentRecord r = repository.findById(n.path("id").asText()).orElseThrow();
            r.setName(n.path("name").asText()); r.setRegisterNumber(n.path("registerNumber").asText());
            r.setEmail(n.path("email").asText()); r.setYearLevel(n.path("year").asInt()); r.setSectionName(n.path("section").asText());
            r.setTotalSolved(n.path("codingStats").path("totalSolved").asInt()); r.setProfileJson(mapper.writeValueAsString(n)); repository.save(r);
        } catch (Exception e) { throw new IllegalStateException("Could not save student profile", e); }
    }
    public JsonNode findByEmail(String email) { return all().stream().filter(s -> s.path("email").asText().equalsIgnoreCase(email)).findFirst().orElse(null); }
    public JsonNode findByRegister(String register) { return all().stream().filter(s -> s.path("registerNumber").asText().equals(register)).findFirst().orElse(null); }
    public List<JsonNode> faculty() { return faculty; }
    public JsonNode facultyByEmail(String email, String role) { return faculty.stream().filter(f -> f.path("email").asText().equalsIgnoreCase(email) && f.path("role").asText().equals(role)).findFirst().orElse(null); }
    public JsonNode userForStudent(JsonNode s, String token) {
        ObjectNode u = mapper.createObjectNode();
        for (String key : List.of("id","name","email","avatar","department","registerNumber","year","section")) u.set(key, s.path(key));
        u.put("role", "Student"); if (token != null) u.put("token", token); return u;
    }
    public JsonNode userForFaculty(JsonNode f, String token) {
        ObjectNode u = mapper.createObjectNode();
        for (String key : List.of("id","name","email","avatar","department","role")) u.set(key, f.path(key));
        if (token != null) u.put("token", token); return u;
    }
    public int solved(JsonNode s) { return s.path("codingStats").path("totalSolved").asInt(); }
    public int readiness(int total) { return Math.max(0, Math.min(100, (int)Math.round(28 + 0.105 * total))); }
    public String today() { return LocalDate.now().toString(); }
}
