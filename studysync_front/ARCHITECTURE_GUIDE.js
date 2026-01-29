// ============================================
// QUICK REFERENCE: New Dashboard Architecture
// ============================================

// 1️⃣ USE USER CONTEXT (instead of Redux selector)
// ============================================
import { useUser } from '../../context/UserContext';

function MyComponent() {
  // ❌ OLD WAY (duplicated across components)
  // const user = useSelector((state) => state.user.user);
  
  // ✅ NEW WAY (centralized)
  const { user, username, email, isLoggedIn } = useUser();
  
  return <div>Hello, {username}!</div>;
}

// 2️⃣ DASHBOARD PATTERN: Smart Container
// ============================================
import { useApi } from '../../hooks/useApi';

function DashboardPage() {
  // Fetch all data at top level
  const { data, loading, error, refetch } = useApi('/api/endpoint');
  
  // Handle states
  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent onRetry={refetch} />;
  
  // Pass data down to presentation components
  return <PresentationComponent data={data} onRefresh={refetch} />;
}

// 3️⃣ PRESENTATION COMPONENT: Receives Props
// ============================================
function PresentationComponent({ data, onRefresh }) {
  // ❌ DON'T fetch data here
  // const { data } = useApi('/api/endpoint');
  
  // ✅ DO use props
  return (
    <div>
      <DataDisplay items={data} />
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}

// 4️⃣ DATA FLOW DIAGRAM
// ============================================
/*
  App.jsx
    └── UserProvider (wraps everything)
         └── Dashboard (Smart - fetches data)
              ├── useUser() hook
              ├── useApi('/stats')
              ├── useApi('/progress')
              │
              └── CardContainer (Dumb - receives props)
                   ├── props.stats
                   ├── props.progressData
                   └── props.onRefreshProgress()
*/

// 5️⃣ WHEN TO USE WHAT
// ============================================

// Use useUser() when:
// - Need user info (name, email, auth status)
// - Replace Redux user selector
function exampleUserHook() {
  const { username } = useUser();
  return username;
}

// Use useApi() when:
// - Fetching data from backend
// - Need loading/error states
// - Want automatic refetch
function exampleApiHook() {
  const { data, loading, error, refetch } = useApi('/endpoint');
  return { data, loading, error, refetch };
}

// Use props when:
// - Child component needs data from parent
// - Building presentation components
function Child({ data, onAction }) { 
  return null;
}

// 6️⃣ COMMON PATTERNS
// ============================================

// Pattern A: Fetch and display
function PatternA() {
  const { data, loading, error } = useApi('/tasks');
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <TaskList tasks={data} />;
}

// Pattern B: Manual trigger (POST/PUT/DELETE)
function PatternB() {
  const { execute, loading } = useApi('/tasks', { method: 'POST', manual: true });
  const handleSubmit = async (taskData) => {
    await execute(taskData);
    refetch(); // Refresh list
  };
  return null;
}

// Pattern C: Centralized loading
function PatternC() {
  const stats = useApi('/stats');
  const progress = useApi('/progress');
  const isLoading = stats.loading || progress.loading;
  return isLoading;
}

// 7️⃣ CHECKLIST FOR NEW FEATURES
// ============================================
/*
  ✅ 1. Fetch data in smart container (Dashboard)
  ✅ 2. Handle loading/error states
  ✅ 3. Pass data as props to presentation component
  ✅ 4. Use callbacks for actions (onSave, onDelete, etc.)
  ✅ 5. Use useUser() instead of Redux selector
  ✅ 6. Keep components small and focused
  ✅ 7. Avoid duplicate data fetching
*/

// 8️⃣ FILE STRUCTURE
// ============================================
/*
src/
├── context/
│   └── UserContext.jsx          (Centralized user state)
│
├── hooks/
│   └── useApi.js                (Generic API hook)
│
├── pages/
│   └── Dashboard/
│       └── Dashboard.jsx        (Smart container - fetches data)
│
└── components/
    ├── CardContainer/
    │   └── CardContainer.jsx    (Presentation - receives props)
    ├── WelcomeHeader/
    │   └── WelcomeHeader.jsx    (Small focused component)
    ├── DashboardSkeleton/
    │   └── DashboardSkeleton.jsx (Loading state)
    └── DashboardError/
        └── DashboardError.jsx   (Error state)
*/

// 9️⃣ TESTING TIPS
// ============================================

// Test Smart Container:
// - Mock useApi hook
// - Verify correct API calls
// - Test loading/error states

// Test Presentation Component:
// - Pass props directly
// - No need to mock API
// - Test user interactions
// - Verify callbacks are called

// 🔟 PERFORMANCE TIPS
// ============================================

// ✅ DO: Fetch once in parent
function GoodDashboard() {
  const { data } = useApi('/stats');
  return <Child1 data={data} />;
}

// ❌ DON'T: Fetch in multiple children
function BadChild1() {
  const { data } = useApi('/stats'); // Duplicate call!
  return null;
}

// ✅ DO: Use memo for expensive computations
function MemoExample({ data }) {
  const expensiveValue = useMemo(() => 
    computeExpensiveValue(data), 
    [data]
  );
  return expensiveValue;
}

// ✅ DO: Use callback for event handlers
function CallbackExample({ id, onAction }) {
  const handleClick = useCallback(() => {
    onAction(id);
  }, [id, onAction]);
  return handleClick;
}

export default {};
