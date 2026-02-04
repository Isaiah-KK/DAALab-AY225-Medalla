package src;


public class Sorter {

    // --- 1. BUBBLE SORT O(n^2) ---
    public static void bubbleSort(Record[] arr, String sortBy) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                // If arr[j] is "greater" than arr[j+1], swap
                if (compare(arr[j], arr[j + 1], sortBy) > 0) {
                    Record temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // --- 2. INSERTION SORT O(n^2) ---
    public static void insertionSort(Record[] arr, String sortBy) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            Record key = arr[i];
            int j = i - 1;

            // Move elements that are "greater" than key to one position ahead
            while (j >= 0 && compare(arr[j], key, sortBy) > 0) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    // --- 3. MERGE SORT O(n log n) ---
    public static void mergeSort(Record[] arr, String sortBy) {
        if (arr.length < 2) return; // Base case

        int mid = arr.length / 2;
        Record[] left = new Record[mid];
        Record[] right = new Record[arr.length - mid];

        // Fill left and right arrays
        System.arraycopy(arr, 0, left, 0, mid);
        System.arraycopy(arr, mid, right, 0, arr.length - mid);

        // Recursive calls
        mergeSort(left, sortBy);
        mergeSort(right, sortBy);

        // Merge back together
        merge(arr, left, right, sortBy);
    }

    private static void merge(Record[] arr, Record[] left, Record[] right, String sortBy) {
        int i = 0, j = 0, k = 0;

        while (i < left.length && j < right.length) {
            if (compare(left[i], right[j], sortBy) <= 0) {
                arr[k++] = left[i++];
            } else {
                arr[k++] = right[j++];
            }
        }

        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }

    // --- HELPER: Handles the "Column Selection" logic ---
    private static int compare(Record a, Record b, String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "id":
                return Integer.compare(a.getId(), b.getId());
            case "firstname":
                return a.getFirstName().compareToIgnoreCase(b.getFirstName());
            case "lastname":
                return a.getLastName().compareToIgnoreCase(b.getLastName());
            default:
                throw new IllegalArgumentException("Invalid sort column: " + sortBy);
        }
    }
}