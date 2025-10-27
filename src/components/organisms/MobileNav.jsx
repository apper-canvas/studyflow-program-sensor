import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MobileNav = ({ className }) => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "Home"
    },
    {
      name: "Tasks",
      href: "/assignments",
      icon: "FileText"
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: "Calendar"
    },
    {
      name: "Courses",
      href: "/courses",
      icon: "BookOpen"
    },
    {
      name: "Grades",
      href: "/grades",
      icon: "Award"
    }
  ];

  return (
    <div className={cn(
      "bg-white border-t border-gray-200 px-4 py-2",
      className
    )}>
      <nav className="flex justify-around">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-primary" : "text-gray-400"
                )}
              />
              <span className={cn(
                "transition-colors duration-200",
                isActive ? "text-primary" : "text-gray-500"
              )}>
                {item.name}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNav;