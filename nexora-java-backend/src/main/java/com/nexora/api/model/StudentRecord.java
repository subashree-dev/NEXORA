package com.nexora.api.model;

import jakarta.persistence.*;

@Entity
@Table(name="student_records")
public class StudentRecord {
    @Id @Column(length=40) private String id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String registerNumber;
    @Column(nullable=false, unique=true) private String email;
    private int yearLevel;
    @Column(length=10) private String sectionName;
    private int totalSolved;
    @Lob @Column(nullable=false, columnDefinition="LONGTEXT") private String profileJson;

    public StudentRecord() {}
    public String getId(){return id;} public void setId(String v){id=v;}
    public String getName(){return name;} public void setName(String v){name=v;}
    public String getRegisterNumber(){return registerNumber;} public void setRegisterNumber(String v){registerNumber=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public int getYearLevel(){return yearLevel;} public void setYearLevel(int v){yearLevel=v;}
    public String getSectionName(){return sectionName;} public void setSectionName(String v){sectionName=v;}
    public int getTotalSolved(){return totalSolved;} public void setTotalSolved(int v){totalSolved=v;}
    public String getProfileJson(){return profileJson;} public void setProfileJson(String v){profileJson=v;}
}
