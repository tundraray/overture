# [Project Name] — Engine Setup

<!--
Keep only the section for the project's engine and delete the other engines' sections. The settings and folder layouts below are starting points; replace each with what the project actually uses.
Implementation order and setup tasks belong to the work plan.
Text inside these comments is guidance for the author; it is not copied into the document.
-->

**Date**: YYYY-MM-DD · **Engine**: [engine and exact version] · **Platform**: [target platforms]

**Overview.** [two or three plain sentences — which engine and version, why it fits this game, and the platform constraint that shapes the setup most]

---

## Godot Engine Setup
*Use this section if Engine = Godot*

### Project Configuration
**Godot Version**: 4.4.1 (or latest stable)  
**Rendering API**: Forward+ (for 3D) / Compatibility (for 2D/older hardware)  
**Target Platforms**: [Selected platforms]

#### Project Settings
```gdscript
# project.godot essential settings
[application]
config/name="[Project Name]"
config/features=PackedStringArray("4.4", "Forward Plus")
config/icon="res://icon.svg"
run/main_scene="res://scenes/Main.tscn"

[rendering]
renderer/rendering_method="forward_plus"
textures/vram_compression/import_etc2_astc=true

[input]
# Define input map for all platforms
# Example:
move_left={
    "deadzone": 0.5,
    "events": [
        Object(InputEventKey,"resource_local_to_scene":false,"resource_name":"","device":-1,"window_id":0,"alt_pressed":false,"shift_pressed":false,"ctrl_pressed":false,"meta_pressed":false,"pressed":false,"keycode":0,"physical_keycode":65,"key_label":0,"unicode":97,"echo":false,"script":null)
    ]
}
```

#### Folder Structure
```
source/
├── scenes/                 # Game scenes (.tscn)
│   ├── Main.tscn          # Main/entry scene
│   ├── Player.tscn        # Player character
│   └── levels/            # Level scenes
├── scripts/               # GDScript files (.gd)
│   ├── Player.gd          # Player controller
│   ├── GameManager.gd     # Global game management
│   └── autoload/          # Singleton scripts
├── assets/
│   ├── sprites/           # 2D textures
│   ├── models/            # 3D models (.gltf, .fbx)
│   ├── audio/             # Sounds (.ogg, .wav)
│   ├── shaders/           # Custom shaders (.gdshader)
│   └── fonts/             # Font files
└── addons/                # Godot plugins
```

#### Best Practices
- **Naming Convention**: 
  - Scenes: PascalCase (PlayerCharacter.tscn)
  - Scripts: snake_case (player_controller.gd)
  - Variables: snake_case (health_points)
  - Constants: UPPER_SNAKE_CASE (MAX_HEALTH)
- **Signals**: Use for communication between nodes
- **Autoload**: For global managers and singletons
- **Scene Composition**: Build complex objects from simpler scenes
- **Resource Files**: Use .tres for custom resources

#### Analytics Integration
```gdscript
# Analytics event tracking example
extends Node

signal analytics_event(event_name: String, parameters: Dictionary)

func track_player_action(action: String, location: Vector3):
    var event_data = {
        "action": action,
        "location": location,
        "timestamp": Time.get_unix_time_from_system()
    }
    analytics_event.emit("player_action", event_data)
```

---

## Unity Engine Setup
*Use this section if Engine = Unity*

### Project Configuration
**Unity Version**: 2023.2 LTS (or latest LTS)  
**Render Pipeline**: URP (Universal Render Pipeline)  
**Target Platforms**: [Selected platforms]

#### Project Structure
```
source/
├── Assets/
│   ├── Scripts/           # C# scripts
│   │   ├── Player/        # Player-related scripts
│   │   ├── Managers/      # Game managers
│   │   └── UI/            # UI scripts
│   ├── Scenes/            # Unity scenes
│   │   ├── MainMenu.unity
│   │   ├── Game.unity
│   │   └── Levels/
│   ├── Prefabs/           # Reusable GameObjects
│   │   ├── Characters/
│   │   ├── Environment/
│   │   └── UI/
│   ├── Materials/         # Materials and shaders
│   ├── Textures/          # 2D textures
│   ├── Models/            # 3D models
│   ├── Audio/             # Audio files
│   ├── Animations/        # Animation clips
│   └── Resources/         # Runtime loadable assets
├── Packages/              # Package Manager dependencies
└── ProjectSettings/       # Unity project settings
```

#### Essential Packages
```json
{
  "dependencies": {
    "com.unity.inputsystem": "1.7.0",
    "com.unity.render-pipelines.universal": "14.0.9",
    "com.unity.textmeshpro": "3.0.6",
    "com.unity.analytics": "4.4.0",
    "com.unity.cinemachine": "2.9.7",
    "com.unity.postprocessing": "3.2.2"
  }
}
```

#### Best Practices
- **Naming Convention**:
  - Classes: PascalCase (PlayerController)
  - Methods: PascalCase (MovePlayer)
  - Variables: camelCase (currentHealth)
  - Constants: UPPER_CASE (MAX_HEALTH)
- **Component Architecture**: Use composition over inheritance
- **ScriptableObjects**: For data assets and configuration
- **Events/UnityActions**: For decoupled communication
- **Object Pooling**: For frequently instantiated objects

#### Analytics Integration
```csharp
using Unity.Analytics;
using UnityEngine;

public class AnalyticsManager : MonoBehaviour
{
    public static void TrackPlayerAction(string action, Vector3 location)
    {
        var eventData = new Dictionary<string, object>
        {
            {"action", action},
            {"location_x", location.x},
            {"location_y", location.y},
            {"location_z", location.z},
            {"timestamp", System.DateTime.UtcNow.ToString()}
        };
        
        Analytics.CustomEvent("player_action", eventData);
    }
}
```

---

## Unreal Engine Setup
*Use this section if Engine = Unreal Engine*

### Project Configuration
**Unreal Version**: 5.3 (or latest stable)  
**Project Type**: Games  
**Template**: Third Person / First Person / Blank  
**Target Platforms**: [Selected platforms]

#### Project Structure
```
source/
├── Content/
│   ├── Blueprints/        # Blueprint classes
│   │   ├── Characters/    # Character blueprints
│   │   ├── GameMode/      # Game mode blueprints
│   │   └── UI/            # Widget blueprints
│   ├── Maps/              # Game levels
│   │   ├── MainMenu.umap
│   │   ├── GameLevel.umap
│   │   └── TestLevel.umap
│   ├── Materials/         # Materials and shaders
│   ├── Meshes/            # Static and skeletal meshes
│   ├── Textures/          # Texture assets
│   ├── Audio/             # Audio files
│   ├── Animations/        # Animation assets
│   ├── Particles/         # Niagara particle systems
│   └── UI/                # Widget blueprints
├── Source/                # C++ source code (if using C++)
│   ├── Public/            # Header files
│   └── Private/           # Implementation files
├── Config/                # Configuration files
└── Plugins/               # Third-party plugins
```

#### Project Settings
```cpp
// Example .uproject file
{
    "FileVersion": 3,
    "EngineAssociation": "5.3",
    "Category": "",
    "Description": "",
    "Modules": [
        {
            "Name": "[ProjectName]",
            "Type": "Runtime",
            "LoadingPhase": "Default"
        }
    ],
    "Plugins": [
        {
            "Name": "ModelingToolsEditorMode",
            "Enabled": true
        },
        {
            "Name": "GameplayAbilities",
            "Enabled": true
        }
    ]
}
```

#### Best Practices
- **Naming Convention**:
  - Blueprint Classes: BP_PlayerCharacter
  - C++ Classes: APlayerCharacter (Actor), UPlayerComponent (Component)
  - Variables: bIsAlive (boolean), CurrentHealth (others)
  - Functions: PascalCase (MovePlayer)
- **Blueprint vs C++**: Use Blueprints for rapid iteration, C++ for performance-critical code
- **Gameplay Framework**: Utilize Pawn, Controller, GameMode, GameState patterns
- **Component Architecture**: Build functionality through components
- **Data Assets**: Use for configuration and game data

#### Analytics Integration
```cpp
// C++ Analytics example
UCLASS()
class GAME_API UAnalyticsManager : public UObject
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category = "Analytics")
    static void TrackPlayerAction(const FString& Action, const FVector& Location);
};

void UAnalyticsManager::TrackPlayerAction(const FString& Action, const FVector& Location)
{
    TMap<FString, FString> EventData;
    EventData.Add(TEXT("action"), Action);
    EventData.Add(TEXT("location"), Location.ToString());
    EventData.Add(TEXT("timestamp"), FDateTime::UtcNow().ToString());
    
    // Send to analytics service
    // Implementation depends on chosen analytics provider
}
```

---

## Platform Settings

<!-- Only the engine settings that differ per target platform — texture and audio compression, input map, quality presets. Frame rate, memory, and download-size targets are owned by the GDD's Technical Requirements: cite them, do not repeat them. -->

| Platform | Settings that differ | Why |
|---|---|---|
| [platform] | [compression, input, quality preset] | [the GDD target or platform rule it serves] |

## Build and Test

- **Test framework**: [the engine test tool the project uses, and what it runs]
- **Build pipeline**: [how a build is produced for each target platform]

## Analytics and Telemetry Setup

<!-- Events, metrics, and privacy rules are owned by the analytics setup document; this section names only how the engine connects to them. -->

- **Analytics SDK hook**: [where the engine sends events]
- **Profiling and crash reporting**: [engine tools and platform crash reporting]
