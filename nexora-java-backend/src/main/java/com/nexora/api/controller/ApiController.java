package com.nexora.api.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nexora.api.service.StudentDataService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final StudentDataService data; private final ObjectMapper mapper;
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private record Session(String userId, String role, String email) {}
    public ApiController(StudentDataService data, ObjectMapper mapper) { this.data=data; this.mapper=mapper; }

    private Map<String,Object> error(String message) { return Map.of("error", message); }
    private Session session(HttpServletRequest req) {
        String h=req.getHeader("Authorization");
        if (h==null || !h.startsWith("Bearer ")) return null;
        return sessions.get(h.substring(7).trim());
    }
    private Session require(HttpServletRequest req, String... roles) {
        Session s=session(req); if(s==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authentication required. Please sign in.");
        if(Arrays.stream(roles).noneMatch(r->r.equals(s.role()))) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Access denied for this role.");
        return s;
    }
    private JsonNode student(Session s) { return data.get(s.userId()); }
    private List<JsonNode> students() { return data.all(); }
    private int solved(JsonNode s) { return data.solved(s); }
    private int score(JsonNode s) { return data.readiness(solved(s)); }
    private Map<String,Object> map(Object... kv) { Map<String,Object> m=new LinkedHashMap<>(); for(int i=0;i<kv.length;i+=2)m.put((String)kv[i],kv[i+1]); return m; }

    @PostMapping("/auth/login")
    public Map<String,Object> login(@RequestBody Map<String,Object> body) {
        String role=String.valueOf(body.getOrDefault("role","")), email=String.valueOf(body.getOrDefault("email"," ")).trim().toLowerCase(), password=String.valueOf(body.getOrDefault("password",""));
        if(role.isBlank()||email.isBlank()||password.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Role, email, and password are required.");
        if(!email.endsWith("@eec.srmrmp.edu.in")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Use an official college email ending with @eec.srmrmp.edu.in.");
        JsonNode user; String id;
        if(role.equals("Student")) {
            String reg=String.valueOf(body.getOrDefault("registerNumber","" )).trim();
            if(reg.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Register number is required for student login.");
            if(!email.equals(reg+"@eec.srmrmp.edu.in")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Register number and college email mismatch.");
            user=data.findByRegister(reg);
            if(user==null) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"No student record found for this register number.");
            if(!Set.of("Student@eec2026","password","eec@123","Nexora@2026").contains(password)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid student password credentials.");
            id=user.path("id").asText();
        } else if(role.equals("Faculty") || role.equals("HOD")) {
            user=data.facultyByEmail(email,role);
            if(user==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"No authorized account found for this email and role.");
            Set<String> valid=role.equals("HOD")?Set.of("Hod@eec2026","password","eec@123"):Set.of("Faculty@eec2026","password","eec@123");
            if(!valid.contains(password)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid password credentials."); id=user.path("id").asText();
        } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid role specified.");
        String token="nex_"+UUID.randomUUID().toString().replace("-",""); sessions.put(token,new Session(id,role,email));
        JsonNode authUser=role.equals("Student")?data.userForStudent(user,token):data.userForFaculty(user,token);
        return map("token",token,"user",authUser,"message",role+" authenticated successfully.");
    }
    @PostMapping("/auth/logout") public Map<String,String> logout(HttpServletRequest req) { Session s=session(req); String h=req.getHeader("Authorization"); if(h!=null&&h.startsWith("Bearer "))sessions.remove(h.substring(7).trim()); return Map.of("message","Signed out successfully."); }
    @GetMapping("/auth/me") public JsonNode me(HttpServletRequest req) { Session s=require(req,"Student","Faculty","HOD"); JsonNode u=s.role().equals("Student")?data.userForStudent(student(s),null):data.userForFaculty(data.faculty().stream().filter(f->f.path("id").asText().equals(s.userId())).findFirst().orElseThrow(),null); return u; }
    @GetMapping("/student/me") public JsonNode myProfile(HttpServletRequest req) { JsonNode s=student(require(req,"Student")); if(s==null)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Student record not found."); return s; }
    @PostMapping("/student/me/leetcode") public Map<String,Object> saveLeetCode(HttpServletRequest req,@RequestBody Map<String,String> body) {
        Session session=require(req,"Student"); JsonNode found=student(session); if(found==null)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Student record not found.");
        String username=body.getOrDefault("username","").trim(); if(username.isBlank())throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Valid LeetCode username is required.");
        ObjectNode s=(ObjectNode)found; ObjectNode profiles=(ObjectNode)s.path("profiles"); ObjectNode lc=(ObjectNode)profiles.path("leetcode"); lc.put("username",username);lc.put("profileUrl","https://leetcode.com/u/"+username);lc.put("lastActivity",data.today());
        ObjectNode stats=(ObjectNode)s.path("codingStats");stats.put("lastActiveDate",data.today()); ObjectNode readiness=(ObjectNode)s.path("placementReadiness");readiness.put("overallScore",data.readiness(solved(s)));readiness.put("lastAuditDate",data.today()); data.saveProfile(s);
        return map("message","LeetCode profile connected successfully.","student",s);
    }
    @GetMapping("/student/me/readiness") public Map<String,Object> readiness(HttpServletRequest req) { JsonNode s=student(require(req,"Student"));int total=solved(s);return map("predictedScore",total>0?score(s):0,"totalSolved",total,"status",s.path("placementReadiness").path("status").asText("Active"),"lastAuditDate",s.path("placementReadiness").path("lastAuditDate").asText(data.today()),"isAvailable",total>0,"explanation",total>0?"Your estimated readiness based on your current coding progress.":"Connect your LeetCode profile to calculate your placement readiness score."); }
    @GetMapping("/student/me/ai-insight") public Map<String,Object> insight(HttpServletRequest req) { JsonNode s=student(require(req,"Student"));int n=solved(s);String interpretation,recommendation;if(n==0){interpretation="No LeetCode activity has been recorded yet for your account.";recommendation="Connect your LeetCode profile and solve 2 foundational Easy array and string problems this week to begin your coding streak.";}else if(n<150){interpretation="You have built a solid foundation with "+n+" problems solved, primarily focusing on core programming patterns.";recommendation="Focus on solving 3-4 Medium difficulty problems weekly in Two Pointers and Binary Search to prepare for technical assessments.";}else if(n<400){interpretation="You are demonstrating consistent problem-solving habits with "+n+" solved problems across Easy and Medium categories.";recommendation="Strengthen your Dynamic Programming and Graph traversal fundamentals to accelerate your placement readiness.";}else{interpretation="Exceptional problem-solving depth with "+n+" problems solved, demonstrating advanced algorithmic fluency.";recommendation="Participate in weekly LeetCode contests to optimize your speed and time complexity under timed conditions.";}return map("interpretation",interpretation,"recommendation",recommendation,"source","rule-based-fallback","generatedAt",Instant.now().toString()); }
    @GetMapping("/student/me/rank") public Map<String,Object> rank(HttpServletRequest req) {
        JsonNode me=student(require(req,"Student"));List<JsonNode> sec=students().stream().filter(s->s.path("year").asInt()==me.path("year").asInt()&&s.path("section").asText().equalsIgnoreCase(me.path("section").asText())).sorted(Comparator.comparingInt(this::solved).reversed()).toList();
        List<JsonNode> yr=students().stream().filter(s->s.path("year").asInt()==me.path("year").asInt()).sorted(Comparator.comparingInt(this::solved).reversed()).toList();
        int sr=rankOf(sec,me),yrank=rankOf(yr,me);List<JsonNode> nearby=yr.stream().skip(Math.max(0,yrank-3)).limit(5).toList();List<Map<String,Object>> board=new ArrayList<>();for(JsonNode s:nearby)board.add(map("rank",rankOf(yr,s),"name",s.path("name").asText(),"registerNumber",s.path("registerNumber").asText(),"totalSolved",solved(s),"isCurrentStudent",s.path("id").asText().equals(me.path("id").asText()),"section",s.path("section").asText()));
        return map("studentId",me.path("id").asText(),"studentName",me.path("name").asText(),"registerNumber",me.path("registerNumber").asText(),"section",me.path("section").asText(),"year",me.path("year").asInt(),"totalSolved",solved(me),"sectionRank",sr,"sectionTotalStudents",sec.size(),"yearRank",yrank,"yearTotalStudents",yr.size(),"lastUpdatedDate",me.path("codingStats").path("lastActiveDate").asText(data.today()),"nearbyLeaderboard",board);
    }
    private int rankOf(List<JsonNode> list,JsonNode target){int rank=1;for(int i=0;i<list.size();i++){if(i>0&&solved(list.get(i))<solved(list.get(i-1)))rank=i+1;if(list.get(i).path("id").asText().equals(target.path("id").asText()))return rank;}return list.size();}

    @GetMapping("/faculty/dashboard") public Map<String,Object> facultyDashboard(HttpServletRequest req) { require(req,"Faculty","HOD");List<JsonNode> ss=students();int active=(int)ss.stream().filter(s->solved(s)>0).count();int avg=(int)Math.round(ss.stream().mapToInt(this::solved).average().orElse(0));int ready=(int)Math.round(ss.stream().mapToInt(this::score).average().orElse(0));List<Map<String,Object>> compact=ss.stream().limit(8).map(s->map("id",s.path("id").asText(),"name",s.path("name").asText(),"registerNumber",s.path("registerNumber").asText(),"year",s.path("year").asInt(),"section",s.path("section").asText(),"totalSolved",solved(s),"readinessScore",score(s),"leetcodeUsername",s.path("profiles").path("leetcode").path("username").asText())).toList();return map("totalScopeStudents",ss.size(),"studentsWithCodingData",active,"missingCodingData",ss.size()-active,"avgProblemsSolved",avg,"avgReadinessScore",ready,"compactStudentProgress",compact); }
    @GetMapping("/faculty/students") public Map<String,Object> facultyStudents(HttpServletRequest req,@RequestParam(defaultValue="ALL") String year,@RequestParam(defaultValue="ALL") String section,@RequestParam(defaultValue="") String q) {require(req,"Faculty","HOD");String query=q.toLowerCase().trim();List<Map<String,Object>> out=students().stream().filter(s->year.equals("ALL")||String.valueOf(s.path("year").asInt()).equals(year)).filter(s->section.equals("ALL")||s.path("section").asText().equalsIgnoreCase(section)).filter(s->query.isBlank()||s.path("name").asText().toLowerCase().contains(query)||s.path("registerNumber").asText().contains(query)||s.path("profiles").path("leetcode").path("username").asText().toLowerCase().contains(query)).map(s->map("id",s.path("id").asText(),"name",s.path("name").asText(),"registerNumber",s.path("registerNumber").asText(),"year",s.path("year").asInt(),"section",s.path("section").asText(),"leetcodeUsername",s.path("profiles").path("leetcode").path("username").asText(),"leetcodeProfileUrl",s.path("profiles").path("leetcode").path("profileUrl").asText(),"totalSolved",solved(s),"easySolved",s.path("codingStats").path("easySolved").asInt(),"mediumSolved",s.path("codingStats").path("mediumSolved").asInt(),"hardSolved",s.path("codingStats").path("hardSolved").asInt(),"readinessScore",score(s),"lastActiveDate",s.path("codingStats").path("lastActiveDate").asText())).toList();return map("students",out,"total",out.size()); }
    @GetMapping("/faculty/class-progress") public Map<String,Object> classProgress(HttpServletRequest req) {require(req,"Faculty","HOD");List<JsonNode> ss=students();TreeSet<String> sections=ss.stream().map(s->s.path("section").asText().toUpperCase()).collect(Collectors.toCollection(TreeSet::new));List<Map<String,Object>> stats=new ArrayList<>();for(String sec:sections){List<JsonNode> group=ss.stream().filter(s->s.path("section").asText().equalsIgnoreCase(sec)).toList();int sum=group.stream().mapToInt(this::solved).sum();stats.add(map("section",sec,"studentCount",group.size(),"activeProfiles",(int)group.stream().filter(s->solved(s)>0).count(),"totalSolved",sum,"avgSolved",(int)Math.round((double)sum/Math.max(1,group.size()))));}List<Map<String,Object>> guidance=ss.stream().filter(s->solved(s)<100).map(s->map("id",s.path("id").asText(),"name",s.path("name").asText(),"registerNumber",s.path("registerNumber").asText(),"year",s.path("year").asInt(),"section",s.path("section").asText(),"totalSolved",solved(s),"readinessScore",score(s),"indicatorNote","Identified for academic coding support review")).toList();List<Map<String,Object>> missing=ss.stream().filter(s->solved(s)==0).map(s->map("id",s.path("id").asText(),"name",s.path("name").asText(),"registerNumber",s.path("registerNumber").asText(),"year",s.path("year").asInt(),"section",s.path("section").asText())).toList();return map("sectionStats",stats,"studentsNeedingGuidance",guidance,"missingProfiles",missing); }
    @GetMapping("/hod/department-overview") public Map<String,Object> hodOverview(HttpServletRequest req){require(req,"HOD");List<JsonNode> ss=students();int active=(int)ss.stream().filter(s->solved(s)>0).count();return map("totalStudents",ss.size(),"withCodingData",active,"participationRate",(int)Math.round(100.0*active/Math.max(1,ss.size())),"missingCodingProfiles",ss.size()-active,"avgProblemsSolved",(int)Math.round(ss.stream().mapToInt(this::solved).average().orElse(0)),"avgReadinessScore",(int)Math.round(ss.stream().mapToInt(this::score).average().orElse(0)),"department","Artificial Intelligence & Data Science");}
    @GetMapping("/hod/comparison") public Map<String,Object> hodComparison(HttpServletRequest req){require(req,"HOD");List<JsonNode> ss=students();TreeSet<Integer> years=ss.stream().map(s->s.path("year").asInt()).collect(Collectors.toCollection(TreeSet::new));List<Map<String,Object>> yc=new ArrayList<>();for(int y:years){List<JsonNode> g=ss.stream().filter(s->s.path("year").asInt()==y).toList();int active=(int)g.stream().filter(s->solved(s)>0).count();yc.add(map("year",y,"totalStudents",g.size(),"activeProfiles",active,"participationPct",(int)Math.round(100.0*active/Math.max(1,g.size())),"avgSolved",(int)Math.round(g.stream().mapToInt(this::solved).average().orElse(0)),"avgReadinessScore",(int)Math.round(g.stream().mapToInt(this::score).average().orElse(0))));}TreeSet<String> secs=ss.stream().map(s->s.path("section").asText().toUpperCase()).collect(Collectors.toCollection(TreeSet::new));List<Map<String,Object>> sb=new ArrayList<>();for(String sec:secs){List<JsonNode> g=ss.stream().filter(s->s.path("section").asText().equalsIgnoreCase(sec)).toList();sb.add(map("section",sec,"count",g.size(),"avgSolved",(int)Math.round(g.stream().mapToInt(this::solved).average().orElse(0))));}return map("yearComparisons",yc,"sectionBreakdown",sb);}
    @GetMapping("/hod/reports") public Map<String,Object> reports(HttpServletRequest req){require(req,"HOD");List<Map<String,Object>> rows=students().stream().map(s->map("name",s.path("name").asText(),"registerNumber",s.path("registerNumber").asText(),"year",s.path("year").asInt(),"section",s.path("section").asText(),"leetcodeUsername",s.path("profiles").path("leetcode").path("username").asText(),"totalSolved",solved(s),"easySolved",s.path("codingStats").path("easySolved").asInt(),"mediumSolved",s.path("codingStats").path("mediumSolved").asInt(),"hardSolved",s.path("codingStats").path("hardSolved").asInt(),"placementReadinessScore",score(s),"lastAuditDate",s.path("codingStats").path("lastActiveDate").asText())).toList();return map("generatedAt",Instant.now().toString(),"department","Artificial Intelligence & Data Science","totalRecords",rows.size(),"records",rows);}
    @GetMapping("/regression/predict") public Map<String,Object> predict(@RequestParam int totalSolved){if(totalSolved<0)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Valid non-negative totalSolved parameter is required");double raw=28+0.105*totalSolved;int predicted=(int)Math.max(0,Math.min(100,Math.round(raw)));return map("totalSolved",totalSolved,"predictedScore",predicted,"rawScore",raw,"formula","score = 28 + 0.105 × totalSolved (demo estimate)","explanation","Demonstration estimate only; the model is not validated against real placement outcomes.","isDemoData",true);}
    @GetMapping("/regression/model") public Map<String,Object> model(){return map("slope",0.105,"intercept",28,"rSquared",0.0,"meanSquaredError",0.0,"sampleSize",17,"trainingData",List.of(),"datasetDescription","Synthetic demonstration model; not validated against real placement outcomes.","isDemoData",true);}
}
