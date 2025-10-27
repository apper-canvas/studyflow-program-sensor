import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";

const FilterBar = ({
  courses = [],
  selectedCourse,
  onCourseChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  searchTerm,
  onSearchChange,
  className
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <SearchBar
        placeholder="Search assignments..."
        onSearch={onSearchChange}
        value={searchTerm}
      />
      
      <Select
        value={selectedCourse}
        onChange={(e) => onCourseChange(e.target.value)}
      >
        <option value="">All Courses</option>
        {courses.map(course => (
          <option key={course.Id} value={course.Id}>
            {course.name}
          </option>
        ))}
      </Select>

      <Select
        value={selectedPriority}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </Select>

      <Select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="overdue">Overdue</option>
      </Select>
    </div>
  );
};

export default FilterBar;