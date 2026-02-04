package src;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Sorting_Algo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String filePath = "PrelimExam_DAA_Lab/100data/generated_data.csv"; 
        String userChoice; // Variable to control the loop

        System.out.println("=== SORTING ALGORITHM STRESS TEST ===");

        // --- STEP 1: Load Data (ONLY ONCE) ---
        // We load this outside the loop so we don't waste time re-reading the file every retry.
        System.out.println("Loading data from file...");
        long loadStart = System.nanoTime();
        List<Record> allRecords = loadData(filePath);
        long loadEnd = System.nanoTime();
        
        if (allRecords.isEmpty()) {
            System.out.println("Error: No data loaded. Check file path: " + System.getProperty("user.dir") + "/" + filePath);
            return;
        }
        System.out.printf("Data Loaded in %.4f seconds. Total Records: %d%n", 
                (loadEnd - loadStart) / 1_000_000_000.0, allRecords.size());

        // --- START OF DO-WHILE LOOP ---
        do {
            System.out.println("\n-----------------------------------------");
            
            // --- STEP 2: User Inputs ---
            System.out.print("Enter number of rows to sort (N): ");
            // Validate integer input to prevent crashing
            while (!scanner.hasNextInt()) {
                System.out.println("Invalid input. Please enter a number.");
                scanner.next(); 
            }
            int n = scanner.nextInt();
            
            // Limit N to the actual file size
            if (n > allRecords.size()) {
                System.out.println("Input exceeds file size. Setting N to max (" + allRecords.size() + ").");
                n = allRecords.size();
            } else if (n <= 0) {
                 System.out.println("N must be greater than 0. Setting N to 100.");
                 n = 100;
            }

            // Create a fresh subset array for this specific run
            Record[] dataset = new Record[n];
            for(int i=0; i<n; i++) dataset[i] = allRecords.get(i);

            System.out.println("\nChoose Column to Sort By:");
            System.out.println("1. ID");
            System.out.println("2. FirstName");
            System.out.println("3. LastName");
            System.out.print("Choice: ");
            int colChoice = scanner.nextInt();
            String sortBy = (colChoice == 1) ? "id" : (colChoice == 2) ? "firstname" : "lastname";

            System.out.println("\nChoose Algorithm:");
            System.out.println("1. Bubble Sort");
            System.out.println("2. Insertion Sort");
            System.out.println("3. Merge Sort");
            System.out.print("Choice: ");
            int algoChoice = scanner.nextInt();

            // --- STEP 3: The Warning ---
            boolean proceed = true;
            if ((algoChoice == 1 || algoChoice == 2) && n > 20000) {
                System.out.println("\nWARNING: You selected an O(n^2) algorithm for " + n + " records.");
                System.out.println("Bubble/Insertion sort will be extremely slow (minutes or hours).");
                System.out.print("Are you sure you want to continue? (y/n): ");
                String confirm = scanner.next();
                if (!confirm.equalsIgnoreCase("y")) {
                    proceed = false;
                }
            }

            // --- STEP 4: Execute & Time ---
            if (proceed) {
                System.out.println("\nStarting sort... please wait.");
                long sortStart = System.nanoTime();

                switch (algoChoice) {
                    case 1: Sorter.bubbleSort(dataset, sortBy); break;
                    case 2: Sorter.insertionSort(dataset, sortBy); break;
                    case 3: Sorter.mergeSort(dataset, sortBy); break;
                    default: System.out.println("Invalid algorithm choice. Skipping sort.");
                }

                long sortEnd = System.nanoTime();
                double timeTaken = (sortEnd - sortStart) / 1_000_000_000.0;

                // --- STEP 5: Output Results ---
                System.out.println("\n=== SORTING COMPLETE ===");
                System.out.printf("Time Taken: %.5f seconds%n", timeTaken);
                
                System.out.println("\nFirst 10 Sorted Records (Sanity Check):");
                for (int i = 0; i < Math.min(10, dataset.length); i++) {
                    System.out.println(dataset[i]);
                }
            }

            // --- STEP 6: Ask to Restart ---
            System.out.print("\nDo you want to run another test? (y/n): ");
            userChoice = scanner.next();

        } while (userChoice.equalsIgnoreCase("y")); 
        // --- END OF DO-WHILE LOOP ---

        System.out.println("Exiting program. Goodbye!");
        scanner.close();
    }

    // CSV Parser (Unchanged)
    private static List<Record> loadData(String filePath) {
        List<Record> records = new ArrayList<>();
        String line;
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            br.readLine(); // Skip header
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (values.length >= 3) {
                    int id = Integer.parseInt(values[0].trim());
                    String first = values[1].trim();
                    String last = values[2].trim();
                    records.add(new Record(id, first, last));
                }
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        } catch (NumberFormatException e) {
            System.out.println("Skipping malformed row.");
        }
        return records;
    }
}
    