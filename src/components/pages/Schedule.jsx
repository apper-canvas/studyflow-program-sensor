import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import WeeklyScheduleGrid from "@/components/organisms/WeeklyScheduleGrid";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { scheduleService } from "@/services/api/scheduleService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [schedulesData, coursesData] = await Promise.all([
        scheduleService.getAll(),
        courseService.getAll()
      ]);

      setSchedules(schedulesData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleUpdate = async (scheduleId, newDay, newTime) => {
    try {
      const updatedSchedule = await scheduleService.updateTimeSlot(scheduleId, newDay, newTime);
      setSchedules(prev => prev.map(s => s.Id === scheduleId ? updatedSchedule : s));
    } catch (err) {
      throw err;
    }
  };

  const getTotalClassHours = () => {
    let totalMinutes = 0;
    schedules.forEach(schedule => {
      const duration = scheduleService.calculateDuration(schedule.startTime, schedule.endTime);
      totalMinutes += duration;
    });
    return (totalMinutes / 60).toFixed(1);
  };

  const getScheduleStats = () => {
    const stats = {
      totalSessions: schedules.length,
      lectures: schedules.filter(s => s.sessionType === 'Lecture').length,
      labs: schedules.filter(s => s.sessionType === 'Lab').length,
      uniqueRooms: new Set(schedules.map(s => s.roomNumber)).size
    };
    return stats;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const stats = getScheduleStats();

  return (
    <div className="max-w-[1600px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <ApperIcon name="Clock" size={32} />
            <span>Class Schedule</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your weekly timetable with drag-and-drop functionality
          </p>
        </div>
        <Button onClick={loadData} variant="outline" icon="RefreshCw">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl card-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSessions}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Class Hours</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{getTotalClassHours()}h</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lectures</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.lectures}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl card-shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lab Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.labs}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FlaskConical" size={24} className="text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <WeeklyScheduleGrid
        schedules={schedules}
        courses={courses}
        onScheduleUpdate={handleScheduleUpdate}
      />

      {/* Instructions */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <ApperIcon name="Info" size={20} />
          <span>How to Use</span>
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5" />
            <span>Click and drag any class block to move it to a different time slot</span>
          </li>
          <li className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5" />
            <span>The system will prevent scheduling conflicts in the same room</span>
          </li>
          <li className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5" />
            <span>Color-coded blocks match your course colors for easy identification</span>
          </li>
          <li className="flex items-start space-x-2">
            <ApperIcon name="Check" size={16} className="text-success mt-0.5" />
            <span>Room numbers and session types are displayed on each block</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Schedule;