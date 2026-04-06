import AccessControl "./authorization/access-control";
import MixinAuthorization "./authorization/MixinAuthorization";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";



actor GearFlow {
  // Authorization state
  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let adminUsername = "admin";
  var adminPassword = "admin123";

  public type ToolStatus = { #Available; #Issued };
  public type ToolCondition = { #Good; #Fair; #Poor };

  public type Tool = {
    id : Nat;
    name : Text;
    category : Text;
    condition : ToolCondition;
    description : Text;
    location : Text;
    purchaseDate : Text;
    warrantyExpiry : Text;
    status : ToolStatus;
    totalQuantity : Nat;
    availableQuantity : Nat;
  };

  public type Issue = {
    id : Nat;
    toolId : Nat;
    issuedTo : Text;
    issuedDate : Text;
    expectedReturnDate : Text;
    returnDate : Text;
    notes : Text;
    quantity : Nat;
    returnedQuantity : Nat;
    isReturned : Bool;
  };

  public type DashboardStats = {
    totalTools : Nat;
    availableTools : Nat;
    issuedTools : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  var tools : Map.Map<Nat, Tool> = Map.empty<Nat, Tool>();
  var issues : Map.Map<Nat, Issue> = Map.empty<Nat, Issue>();
  var userProfiles : Map.Map<Principal, UserProfile> = Map.empty<Principal, UserProfile>();
  var nextToolId = 1;
  var nextIssueId = 1;

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin authentication
  public query func verifyAdminLogin(username : Text, password : Text) : async Bool {
    if (username == adminUsername and password == adminPassword) {
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func changeAdminPassword(currentPassword : Text, newPassword : Text) : async Bool {
    requireAdmin(caller);
    if (currentPassword == adminPassword) {
      adminPassword := newPassword;
      true;
    } else {
      false;
    };
  };

  // Tool management
  public shared ({ caller }) func addTool(
    name : Text,
    category : Text,
    condition : ToolCondition,
    description : Text,
    location : Text,
    purchaseDate : Text,
    warrantyExpiry : Text,
    totalQuantity : Nat,
  ) : async Tool {
    requireAdmin(caller);
    let tool : Tool = {
      id = nextToolId;
      name;
      category;
      condition;
      description;
      location;
      purchaseDate;
      warrantyExpiry;
      status = #Available;
      totalQuantity;
      availableQuantity = totalQuantity;
    };
    tools.add(nextToolId, tool);
    nextToolId += 1;
    tool;
  };

  public shared ({ caller }) func updateTool(
    id : Nat,
    name : Text,
    category : Text,
    condition : ToolCondition,
    description : Text,
    location : Text,
    purchaseDate : Text,
    warrantyExpiry : Text,
    totalQuantity : Nat,
  ) : async ?Tool {
    requireAdmin(caller);
    switch (tools.get(id)) {
      case (null) { null };
      case (?existing) {
        let quantityDifference = totalQuantity.toInt() - existing.totalQuantity.toInt();
        let newAvailableQuantity = if (quantityDifference > 0) {
          Nat.min(totalQuantity, existing.availableQuantity + quantityDifference.toNat());
        } else {
          if (existing.availableQuantity > (-quantityDifference).toNat()) {
            existing.availableQuantity - (-quantityDifference).toNat();
          } else { 0 };
        };

        let updated : Tool = {
          id;
          name;
          category;
          condition;
          description;
          location;
          purchaseDate;
          warrantyExpiry;
          status = if (newAvailableQuantity > 0) { #Available } else { #Issued };
          totalQuantity;
          availableQuantity = newAvailableQuantity;
        };
        tools.add(id, updated);
        ?updated;
      };
    };
  };

  public shared ({ caller }) func deleteTool(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (tools.get(id)) {
      case (null) { false };
      case (?tool) {
        tools.remove(id);
        true;
      };
    };
  };

  public query func getTool(id : Nat) : async ?Tool {
    tools.get(id);
  };

  public query func getAllTools() : async [Tool] {
    tools.values().toArray();
  };

  public query func getToolsByCategory(category : Text) : async [Tool] {
    tools.values().filter(func(t : Tool) : Bool { t.category == category }).toArray();
  };

  public query func getToolsByStatus(available : Bool) : async [Tool] {
    tools.values().filter(
      func(t : Tool) : Bool {
        if (available) { t.status == #Available } else { t.status == #Issued };
      }
    ).toArray();
  };

  // Issue management
  public shared ({ caller }) func issueTool(
    toolId : Nat,
    issuedTo : Text,
    issuedDate : Text,
    expectedReturnDate : Text,
    notes : Text,
    quantity : Nat,
  ) : async ?Issue {
    requireAdmin(caller);
    switch (tools.get(toolId)) {
      case (null) { null };
      case (?tool) {
        if (quantity > tool.availableQuantity or quantity == 0) {
          return null;
        };

        let newAvailableQuantity = (tool.availableQuantity.toInt() - quantity.toInt()).toNat();
        let newStatus = if (newAvailableQuantity == 0) { #Issued } else { #Available };
        let updatedTool : Tool = {
          id = tool.id;
          name = tool.name;
          category = tool.category;
          condition = tool.condition;
          description = tool.description;
          location = tool.location;
          purchaseDate = tool.purchaseDate;
          warrantyExpiry = tool.warrantyExpiry;
          status = newStatus;
          totalQuantity = tool.totalQuantity;
          availableQuantity = newAvailableQuantity;
        };
        tools.add(toolId, updatedTool);

        let issue : Issue = {
          id = nextIssueId;
          toolId;
          issuedTo;
          issuedDate;
          expectedReturnDate;
          returnDate = "";
          notes;
          quantity;
          returnedQuantity = 0;
          isReturned = false;
        };
        issues.add(nextIssueId, issue);
        nextIssueId += 1;
        ?issue;
      };
    };
  };

  public shared ({ caller }) func returnTool(issueId : Nat, returnDate : Text, returnQuantity : Nat) : async ?Issue {
    requireAdmin(caller);
    switch (issues.get(issueId)) {
      case (null) { null };
      case (?issue) {
        if (issue.isReturned or returnQuantity == 0 or returnQuantity > (issue.quantity - issue.returnedQuantity)) {
          return null;
        };

        switch (tools.get(issue.toolId)) {
          case (null) { return null };
          case (?tool) {
            let newReturnedQuantity = issue.returnedQuantity + returnQuantity;
            let isIssueReturned = newReturnedQuantity >= issue.quantity;

            let updatedIssue : Issue = {
              id = issue.id;
              toolId = issue.toolId;
              issuedTo = issue.issuedTo;
              issuedDate = issue.issuedDate;
              expectedReturnDate = issue.expectedReturnDate;
              returnDate;
              notes = issue.notes;
              quantity = issue.quantity;
              returnedQuantity = newReturnedQuantity;
              isReturned = isIssueReturned;
            };
            issues.add(issueId, updatedIssue);

            let newAvailableQuantity = tool.availableQuantity + returnQuantity;
            let newStatus = if (newAvailableQuantity > 0) { #Available } else { #Issued };
            let updatedTool : Tool = {
              id = tool.id;
              name = tool.name;
              category = tool.category;
              condition = tool.condition;
              description = tool.description;
              location = tool.location;
              purchaseDate = tool.purchaseDate;
              warrantyExpiry = tool.warrantyExpiry;
              status = newStatus;
              totalQuantity = tool.totalQuantity;
              availableQuantity = newAvailableQuantity;
            };
            tools.add(tool.id, updatedTool);

            ?updatedIssue;
          };
        };
      };
    };
  };

  public query func getToolIssueHistory(toolId : Nat) : async [Issue] {
    issues.values().filter(func(i : Issue) : Bool { i.toolId == toolId }).toArray();
  };

  public query func getActiveIssues() : async [Issue] {
    issues.values().filter(func(i : Issue) : Bool { not i.isReturned }).toArray();
  };

  public query func getDashboardStats() : async DashboardStats {
    let total = tools.size();
    let available = tools.values().filter(func(t : Tool) : Bool { t.availableQuantity > 0 }).size();
    let issued = issues.values().filter(func(i : Issue) : Bool { not i.isReturned }).size();
    { totalTools = total; availableTools = available; issuedTools = issued };
  };
};
