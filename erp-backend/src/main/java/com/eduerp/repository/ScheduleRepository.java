package com.eduerp.repository;

import com.eduerp.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDayOfWeek(String dayOfWeek);
    List<Schedule> findByGradeClass(String gradeClass);
    List<Schedule> findByTeacherName(String teacherName);
    List<Schedule> findBySemester(String semester);
}
